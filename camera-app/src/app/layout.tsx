import './globals.css';
import Navbar from './components/NavBar';

export const metadata = {
  title: 'My Camera App',
  description: 'A camera management application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar /> {/* Include the Navbar at the top of every page */}
        <main>{children}</main>
      </body>
    </html>
  );
}
