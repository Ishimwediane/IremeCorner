"use client";

import React, { useState } from 'react';
import {
  Smartphone,
  CreditCard,
  Landmark,
  Copy,
  Check,
  Phone,
  MessageCircle,
  Mail,
  ShieldCheck,
  Palette,
  GraduationCap,
  Users,
  ShoppingBag,
  Share2,
  Handshake,
  ArrowLeft,
  HeartHandshake,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Payment details shown to donors. Update these before going live.
const DONATION_CONFIG = {
  whatsappNumber: '250785933044',
  email: 'iremecorner@gmail.com',
  mobileMoney: [
    {
      id: 'mtn',
      label: 'MTN MoMo',
      number: '0785933044',
      // Name registered on the MoMo account; donors see it before confirming.
      registeredName: '',
      // MTN Rwanda "send money" USSD: *182*1*1*<number>*<amount>#
      ussd: (amount: number) => `*182*1*1*0785933044*${amount}#`,
    },
    {
      id: 'airtel',
      label: 'Airtel Money',
      number: '0790755673',
      registeredName: '',
      ussd: null,
    },
  ],
  // Hosted card checkout link (e.g. Flutterwave or Paystack payment link). Leave empty to hide card payments.
  cardPaymentLink: '',
  // Real bank details only. Leave as null to hide bank transfer.
  bank: null as null | {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swift: string;
  },
};

type Method = 'momo' | 'card' | 'bank';
type Currency = 'RWF' | 'USD';

const PRESETS: Record<Currency, number[]> = {
  RWF: [5000, 10000, 25000, 50000, 100000],
  USD: [10, 25, 50, 100, 250],
};

const IMPACT = [
  { icon: Palette, text: 'Buys raw materials for an artisan' },
  { icon: GraduationCap, text: 'Funds a youth craft training session' },
  { icon: Users, text: 'Helps an artisan family earn a fair income' },
];

const formatAmount = (amount: number, currency: Currency) =>
  currency === 'RWF'
    ? `${amount.toLocaleString('en-US')} RWF`
    : `$${amount.toLocaleString('en-US')}`;

const formatPhone = (number: string) =>
  number.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');

const generateReference = () =>
  `DON-${Date.now().toString(36).slice(-6).toUpperCase()}`;

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available; the value is still visible to copy by hand.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
      aria-label={`Copy ${value}`}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

const DonatePage = () => {
  const availableMethods: { id: Method; label: string; hint: string; icon: typeof Smartphone }[] = [
    { id: 'momo', label: 'Mobile Money', hint: 'MTN MoMo or Airtel Money', icon: Smartphone },
    ...(DONATION_CONFIG.cardPaymentLink
      ? [{ id: 'card' as Method, label: 'Card', hint: 'Visa, Mastercard, international', icon: CreditCard }]
      : []),
    ...(DONATION_CONFIG.bank
      ? [{ id: 'bank' as Method, label: 'Bank transfer', hint: 'Local or international', icon: Landmark }]
      : []),
  ];

  const [method, setMethod] = useState<Method>('momo');
  const [currency, setCurrency] = useState<Currency>('RWF');
  const [amount, setAmount] = useState<number | null>(PRESETS.RWF[1]);
  const [customAmount, setCustomAmount] = useState('');
  const [donor, setDonor] = useState({ name: '', contact: '', message: '' });
  const [anonymous, setAnonymous] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');

  const finalAmount = customAmount ? Number(customAmount) : amount;
  const isValidAmount = !!finalAmount && finalAmount > 0;
  const donorName = anonymous || !donor.name.trim() ? 'Anonymous' : donor.name.trim();

  const handleMethodChange = (next: Method) => {
    setMethod(next);
    // Mobile Money in Rwanda is RWF only.
    if (next === 'momo' && currency !== 'RWF') {
      setCurrency('RWF');
      setAmount(PRESETS.RWF[1]);
      setCustomAmount('');
    }
  };

  const handleCurrencyChange = (next: Currency) => {
    setCurrency(next);
    setAmount(PRESETS[next][1]);
    setCustomAmount('');
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAmount) return;
    setReference(generateReference());
    if (method === 'card' && DONATION_CONFIG.cardPaymentLink) {
      window.open(DONATION_CONFIG.cardPaymentLink, '_blank', 'noopener,noreferrer');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmationMessage = [
    'Hello IremeCorner, I have just sent a donation.',
    `Reference: ${reference}`,
    `Amount: ${finalAmount ? formatAmount(finalAmount, currency) : ''}`,
    `Method: ${availableMethods.find((m) => m.id === method)?.label}`,
    transactionId ? `Transaction ID: ${transactionId}` : '',
    `Name: ${donorName}`,
    donor.message ? `Message: ${donor.message}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const whatsappLink = `https://wa.me/${DONATION_CONFIG.whatsappNumber}?text=${encodeURIComponent(confirmationMessage)}`;
  const emailLink = `mailto:${DONATION_CONFIG.email}?subject=${encodeURIComponent(`Donation ${reference}`)}&body=${encodeURIComponent(confirmationMessage)}`;

  const background = (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed -z-10"
        style={{ backgroundImage: "url('images/wall.jpeg')", opacity: 0.5 }}
      />
      <div className="fixed inset-0 bg-white -z-10" style={{ opacity: 0.7 }} />
    </>
  );

  // Step 2: payment instructions
  if (reference && finalAmount) {
    return (
      <div className="min-h-screen relative">
        {background}
        <Header />

        <main className="py-12 md:py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <button
              onClick={() => setReference(null)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#202f32] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Change amount or method
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Summary */}
              <div className="bg-[#202f32] text-white p-6 md:p-8 text-center">
                <p className="text-orange-300 font-medium mb-1">You are donating</p>
                <p className="text-4xl md:text-5xl font-bold mb-3">{formatAmount(finalAmount, currency)}</p>
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm">
                  <span className="text-gray-300">Reference</span>
                  <span className="font-mono font-semibold tracking-wide">{reference}</span>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                {/* Step 1: Send */}
                <section>
                  <h2 className="flex items-center gap-3 text-lg font-bold text-[#202f32] mb-4">
                    <span className="w-7 h-7 rounded-full bg-orange-400 text-white text-sm flex items-center justify-center">1</span>
                    Send your donation
                  </h2>

                  {method === 'momo' && (
                    <div className="space-y-3">
                      {DONATION_CONFIG.mobileMoney.map((account) => (
                        <div key={account.id} className="border-2 border-gray-100 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-gray-500">{account.label}</p>
                            <CopyButton value={account.number} />
                          </div>
                          <p className="text-2xl font-bold text-gray-900 tracking-wide">{formatPhone(account.number)}</p>
                          {account.registeredName && (
                            <p className="text-sm text-gray-500 mt-1">Registered name: <strong>{account.registeredName}</strong></p>
                          )}
                          {account.ussd && (
                            <a
                              href={`tel:${encodeURIComponent(account.ussd(finalAmount))}`}
                              className="mt-3 inline-flex items-center gap-2 bg-[#ffcb05] hover:brightness-95 text-gray-900 font-semibold px-4 py-2 rounded-lg transition-all md:hidden"
                            >
                              <Phone className="w-4 h-4" />
                              Dial to send {formatAmount(finalAmount, currency)}
                            </a>
                          )}
                        </div>
                      ))}
                      <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside bg-orange-50 rounded-xl p-4">
                        <li>Send <strong>{formatAmount(finalAmount, currency)}</strong> to one of the numbers above</li>
                        <li>Check the name shown before entering your PIN</li>
                        <li>Keep the transaction ID from your confirmation SMS</li>
                      </ol>
                    </div>
                  )}

                  {method === 'card' && (
                    <div className="border-2 border-gray-100 rounded-xl p-4 text-gray-600">
                      <p className="mb-3">
                        Our secure checkout opened in a new tab. Enter <strong>{formatAmount(finalAmount, currency)}</strong> and
                        add <strong>{reference}</strong> as the note or reference.
                      </p>
                      <a
                        href={DONATION_CONFIG.cardPaymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        <CreditCard className="w-4 h-4" />
                        Open checkout again
                      </a>
                    </div>
                  )}

                  {method === 'bank' && DONATION_CONFIG.bank && (
                    <div className="border-2 border-gray-100 rounded-xl divide-y divide-gray-100">
                      {[
                        ['Bank', DONATION_CONFIG.bank.bankName],
                        ['Account name', DONATION_CONFIG.bank.accountName],
                        ['Account number', DONATION_CONFIG.bank.accountNumber],
                        ['SWIFT', DONATION_CONFIG.bank.swift],
                        ['Reference', reference],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between p-4">
                          <div>
                            <p className="text-sm text-gray-500">{label}</p>
                            <p className="font-semibold text-gray-900">{value}</p>
                          </div>
                          <CopyButton value={value} />
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Step 2: Confirm */}
                <section>
                  <h2 className="flex items-center gap-3 text-lg font-bold text-[#202f32] mb-4">
                    <span className="w-7 h-7 rounded-full bg-orange-400 text-white text-sm flex items-center justify-center">2</span>
                    Let us know so we can thank you
                  </h2>
                  {method !== 'card' && (
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Transaction ID from your SMS (optional)"
                      className="w-full px-4 py-3 mb-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                    />
                  )}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Confirm on WhatsApp
                    </a>
                    <a
                      href={emailLink}
                      className="flex items-center justify-center gap-2 border-2 border-[#202f32] text-[#202f32] hover:bg-[#202f32] hover:text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      Confirm by email
                    </a>
                  </div>
                </section>

                <p className="flex items-start gap-2 text-sm text-gray-500">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                  IremeCorner will never ask for your PIN. Only send to the numbers shown on this page.
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Step 1: choose method and amount
  return (
    <div className="min-h-screen relative">
      {background}
      <Header />

      <main className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-[#202f32] mb-4">Support Our Artisans</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Your gift helps preserve Rwandan craft heritage and gives artisans a sustainable livelihood.
            </p>
          </section>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Donation form */}
            <form onSubmit={handleContinue} className="lg:col-span-3 bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-7">
              {/* Method */}
              <div>
                <label className="block text-gray-800 font-semibold mb-3">How would you like to give?</label>
                <div className={`grid gap-3 ${availableMethods.length > 1 ? 'sm:grid-cols-3' : ''}`}>
                  {availableMethods.map(({ id, label, hint, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleMethodChange(id)}
                      className={`flex items-center gap-3 text-left p-4 rounded-xl border-2 transition-all ${
                        method === id ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <Icon className={`w-6 h-6 shrink-0 ${method === id ? 'text-orange-500' : 'text-gray-400'}`} />
                      <span>
                        <span className="block font-semibold text-gray-900">{label}</span>
                        <span className="block text-xs text-gray-500">{hint}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-gray-800 font-semibold">Amount</label>
                  {method !== 'momo' && (
                    <div className="inline-flex rounded-lg bg-gray-100 p-1 text-sm">
                      {(['RWF', 'USD'] as Currency[]).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleCurrencyChange(c)}
                          className={`px-3 py-1 rounded-md font-medium transition-colors ${
                            currency === c ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PRESETS[currency].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setAmount(preset);
                        setCustomAmount('');
                      }}
                      className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                        amount === preset && !customAmount
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      {formatAmount(preset, currency)}
                    </button>
                  ))}
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="numeric"
                      min="1"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Other"
                      className={`w-full h-full py-3 pl-3 pr-12 rounded-xl border-2 font-semibold text-gray-800 outline-none transition-all ${
                        customAmount ? 'border-orange-500' : 'border-gray-200 focus:border-orange-300'
                      }`}
                      aria-label="Other amount"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{currency}</span>
                  </div>
                </div>
              </div>

              {/* Donor details */}
              <div className="space-y-4">
                <label className="block text-gray-800 font-semibold">Your details <span className="font-normal text-gray-400">(optional)</span></label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={donor.name}
                    onChange={(e) => setDonor({ ...donor, name: e.target.value })}
                    disabled={anonymous}
                    placeholder="Full name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-orange-400 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  <input
                    type="text"
                    value={donor.contact}
                    onChange={(e) => setDonor({ ...donor, contact: e.target.value })}
                    placeholder="Phone or email for a receipt"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-orange-400 outline-none transition-all"
                  />
                </div>
                <textarea
                  value={donor.message}
                  onChange={(e) => setDonor({ ...donor, message: e.target.value })}
                  rows={3}
                  placeholder="Leave a message of support"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-800 bg-white focus:border-orange-400 outline-none transition-all"
                />
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="w-4 h-4 accent-orange-500"
                  />
                  Donate anonymously
                </label>
              </div>

              <button
                type="submit"
                disabled={!isValidAmount}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-colors"
              >
                {isValidAmount ? `Donate ${formatAmount(finalAmount!, currency)}` : 'Choose an amount'}
              </button>

              {availableMethods.length === 1 && (
                <p className="text-sm text-gray-500 text-center">
                  Giving from abroad?{' '}
                  <a
                    href={`https://wa.me/${DONATION_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello IremeCorner, I would like to donate from abroad.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Message us on WhatsApp
                  </a>
                </p>
              )}
            </form>

            {/* Impact */}
            <aside className="lg:col-span-2 space-y-6">
              <div className="bg-[#202f32] rounded-2xl shadow-xl p-6 text-white">
                <HeartHandshake className="w-10 h-10 text-orange-300 mb-4" />
                <h2 className="text-2xl font-bold text-orange-300 mb-4">Where your gift goes</h2>
                <ul className="space-y-4">
                  {IMPACT.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-orange-300" />
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 space-y-3 text-gray-600">
                <p className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  You pay directly from your own Mobile Money or bank app. We never see your PIN or card details.
                </p>
                <p className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  Every donation gets a reference so we can confirm it and thank you personally.
                </p>
              </div>
            </aside>
          </div>

          {/* Other ways to support */}
          <section className="mt-16">
            <div className="bg-[#202f32] rounded-2xl shadow-xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-8">Other Ways to Support</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: ShoppingBag, title: 'Shop our crafts', text: 'Buy authentic handmade products directly from our artisans', href: '/shop' },
                  { icon: Share2, title: 'Spread the word', text: 'Share our mission with friends and on social media', href: null },
                  { icon: Handshake, title: 'Become a partner', text: 'Explore partnerships and collaborations with us', href: '/contact' },
                ].map(({ icon: Icon, title, text, href }) => {
                  const content = (
                    <>
                      <span className="w-14 h-14 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-7 h-7 text-[#202f32]" />
                      </span>
                      <h3 className="font-semibold mb-2">{title}</h3>
                      <p className="text-sm text-gray-300">{text}</p>
                    </>
                  );
                  return href ? (
                    <a key={title} href={href} className="p-4 rounded-xl hover:bg-white/5 transition-colors">
                      {content}
                    </a>
                  ) : (
                    <div key={title} className="p-4">{content}</div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonatePage;
