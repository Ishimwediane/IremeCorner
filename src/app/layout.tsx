import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Handmade Rwanda - Village Crafts',
  description: 'Supporting handmade products from Rwandan villages',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body 
        className="bg-fixed bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/background.jpg")',
        }}
      >
        {/* Overlay for better readability */}
        <div className="fixed inset-0 bg-white bg-opacity-90"></div>
        
        {/* Website content that scrolls over fixed background */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}