'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-4 md:px-20 py-4 md:py-5 sticky top-0 z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
          </svg>
          <h2 className="text-black font-black uppercase tracking-tighter">
            <span className="text-lg md:hidden">RealIndia</span>
            <span className="hidden md:inline text-xl">RealEstateIndia</span>
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/" className={`text-sm font-semibold transition-colors ${pathname === '/' ? 'text-black' : 'text-black/50 hover:text-black'}`}>Home</Link>
          <Link href="/properties" className={`text-sm font-semibold transition-colors ${pathname === '/properties' ? 'text-black' : 'text-black/50 hover:text-black'}`}>Properties</Link>
          <Link href="/favorites" className={`text-sm font-semibold transition-colors ${pathname === '/favorites' ? 'text-black' : 'text-black/50 hover:text-black'}`}>Saved</Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button className="hidden md:block text-sm font-bold border-b-2 border-black pb-0.5">SIGN IN</button>
          <Link
            href="/list-property"
            className="bg-black text-white px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-black/90 transition-all"
          >
            Post Property
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 z-50 px-2 py-2">
        <div className="flex items-center justify-around">
          <Link href="/" className={`flex flex-col items-center gap-0.5 px-3 py-1 ${pathname === '/' ? 'text-black' : 'text-black/40'}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12l9-8 9 8M5 10v10h14V10" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
          </Link>
          <Link href="/properties" className={`flex flex-col items-center gap-0.5 px-3 py-1 ${pathname?.startsWith('/properties') ? 'text-black' : 'text-black/40'}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-widest">Search</span>
          </Link>
          <Link href="/favorites" className={`flex flex-col items-center gap-0.5 px-3 py-1 ${pathname === '/favorites' ? 'text-black' : 'text-black/40'}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-widest">Saved</span>
          </Link>
          <Link href="#" className="flex flex-col items-center gap-0.5 px-3 py-1 text-black/40">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-widest">Account</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
