export const metadata = {
  title: 'Web98 Desktop',
  description: 'Windows 98-inspired web desktop'
};

import '98.css/dist/98.css';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

