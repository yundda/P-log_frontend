import Header from './Header';
import { Outlet } from 'react-router-dom';
import { useRef } from 'react';
import Footer from './Footer';

export default function Layout() {
  const headerRef = useRef(null);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-white">
      <div ref={headerRef}>
        <Header />
      </div>
      <main className="pt-10 w-[90%] max-w-[1280px] mx-auto flex-grow overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
