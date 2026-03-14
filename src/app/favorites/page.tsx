'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function FavoritesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7] text-black">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-20 h-20 border-2 border-black flex items-center justify-center mb-6">
          <span className="text-4xl">♡</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
          Saved Properties
        </h1>
        <p className="text-black/50 text-center max-w-md mb-8 text-sm uppercase tracking-wider">
          Sign in to save your favorite properties and access them from any device. It&apos;s completely free.
        </p>
        <Link href="/properties" className="bg-black text-white px-8 py-3 text-sm font-black uppercase tracking-widest hover:bg-black/80 transition-all">
          Browse Properties
        </Link>
        <p className="text-[10px] text-black/30 mt-8 uppercase tracking-widest">
          Click the heart icon on any property card to save it here.
        </p>
      </div>
      <Footer />
    </div>
  );
}
