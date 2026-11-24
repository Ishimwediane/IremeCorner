import dns from 'dns/promises';
import nodemailer from 'nodemailer';
import { configs } from '../../config/index.js';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Turns a send failure into one log line with the server's reply and a hint on how to fix it.
export const describeEmailError = (error) => {
  const reply = (error.response || error.message || '').split('\n')[0];
  let hint = '';
  if (error.code === 'EAUTH' || error.responseCode === 535) {
    hint = 'Gmail rejected the login: check EMAIL_USER and use a Google app password (not your normal password) in EMAIL_PASS.';
  } else if (['ETIMEDOUT', 'ECONNECTION', 'ESOCKET', 'ECONNREFUSED'].includes(error.code)) {
    hint = 'Could not reach the mail server. Render\'s free plan blocks SMTP; use RESEND_API_KEY there instead.';
  }
  return [error.code, reply, hint].filter(Boolean).join(' | ');
};

// Sends email through Resend (HTTPS, works on Render's free plan, which blocks SMTP)
// when RESEND_API_KEY is set, otherwise through SMTP (EMAIL_HOST/EMAIL_USER/EMAIL_PASS).
export class EmailService {
  get isConfigured() {
    const { resendApiKey, user, pass } = configs.email;
    return Boolean(resendApiKey || (user && pass));
  }

  async sendEmail({ to, subject, html, text, replyTo }) {
    const { resendApiKey } = configs.email;

    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: configs.email.resendFrom, to: [to], subject, html, text, reply_to: replyTo }),
      });
      if (!response.ok) {
        throw new Error(`Resend returned ${response.status}: ${await response.text()}`);
      }
      return;
    }

    await (await this.createSmtpTransport()).sendMail({ from: configs.email.from, to, subject, html, text, replyTo });
  }

  async createSmtpTransport() {
    // Connect over IPv4: hosts such as Render have no IPv6 route, and Gmail's IPv6 address fails with ENETUNREACH.
    const { address } = await dns.lookup(configs.email.host, { family: 4 });
    return nodemailer.createTransport({
      host: address,
      tls: { servername: configs.email.host },
      port: configs.email.port,
      secure: configs.email.port === 465,
      // Google shows app passwords in groups of four; the spaces are not part of the password.
      auth: { user: configs.email.user, pass: configs.email.pass.replace(/\s/g, '') },
      connectionTimeout: 15000,
    });
  }

  // Logs whether contact emails can be sent, so problems show up in the server logs at startup.
  async logStatus() {
    const { contactNotifyEmail, resendApiKey, user, host, port } = configs.email;

    if (!contactNotifyEmail) {
      console.log('✉ Contact emails off: CONTACT_NOTIFY_EMAIL is not set');
      return;
    }
    if (!this.isConfigured) {
      console.log('✉ Contact emails off: set RESEND_API_KEY, or EMAIL_USER and EMAIL_PASS for SMTP');
      return;
    }
    if (resendApiKey) {
      console.log(`✉ Contact emails go to ${contactNotifyEmail} through Resend`);
      return;
    }

    try {
      await (await this.createSmtpTransport()).verify();
      console.log(`✓ Contact emails go to ${contactNotifyEmail} through SMTP (${user} on ${host}:${port})`);
    } catch (error) {
      console.error(`❌ Contact emails cannot be sent: SMTP login to ${host}:${port} as ${user} failed`);
      console.error(`   ${describeEmailError(error)}`);
    }
  }

  async sendContactNotification(contact) {
    const to = configs.email.contactNotifyEmail;
    if (!to || !this.isConfigured) return;

    const rows = [
      ['Name', contact.name],
      ['Email', contact.email],
      ['Phone', contact.phone],
      ['Subject', contact.subject],
    ].filter(([, value]) => value);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #202F32;">
        <div style="background: #202F32; color: #EAB86A; padding: 16px 24px; font-size: 18px; font-weight: bold;">
          New message from the IremeCorner website
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb;">
          <table style="border-collapse: collapse; margin-bottom: 16px;">
            ${rows
              .map(
                ([label, value]) =>
                  `<tr><td style="padding: 4px 16px 4px 0; color: #6b7280;">${label}</td><td style="padding: 4px 0;">${escapeHtml(value)}</td></tr>`
              )
              .join('')}
          </table>
          <div style="white-space: pre-wrap; background: #f9fafb; padding: 16px; border-left: 4px solid #EAB86A;">${escapeHtml(contact.message)}</div>
          <p style="color: #6b7280; font-size: 13px; margin-top: 16px;">Reply to this email to answer ${escapeHtml(contact.name)} directly.</p>
        </div>
      </div>
    `;
    const text = [...rows.map(([label, value]) => `${label}: ${value}`), '', contact.message].join('\n');

    await this.sendEmail({
      to,
      subject: `New website message: ${contact.subject || contact.name}`,
      html,
      text,
      replyTo: contact.email,
    });
  }
}
