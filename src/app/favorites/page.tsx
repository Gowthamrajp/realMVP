'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function FavoritesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-20 h-20 bg-accent-50 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-accent-500" />
        </div>
        <h1 className="font-display text-2xl font-bold text-primary-500 mb-2">
          Saved Properties
        </h1>
        <p className="text-slate-500 text-center max-w-md mb-6">
          Sign in to save your favorite properties and access them from any device. It&apos;s completely free!
        </p>
        <div className="flex gap-3">
          <Link href="/properties" className="btn-primary text-sm">
            Browse Properties
          </Link>
        </div>
        <p className="text-xs text-slate-400 mt-8">
          💡 Tip: Click the heart icon on any property card to save it here.
        </p>
      </div>
      <Footer />
    </div>
  );
}
