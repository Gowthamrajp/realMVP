'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Home, Search, Heart, Plus, Menu, X, MapPin } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-primary-500">
              Real<span className="text-accent-500">MVP</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-600 hover:text-primary-500 hover:bg-slate-50 transition-all"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/properties"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-600 hover:text-primary-500 hover:bg-slate-50 transition-all"
            >
              <Search className="w-4 h-4" />
              Explore
            </Link>
            <Link
              href="/favorites"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-600 hover:text-primary-500 hover:bg-slate-50 transition-all"
            >
              <Heart className="w-4 h-4" />
              Saved
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/list-property"
              className="flex items-center gap-2 btn-accent text-sm py-2"
            >
              <Plus className="w-4 h-4" />
              List Property
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
              <Link
                href="/properties"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50"
              >
                <Search className="w-5 h-5" />
                Explore Properties
              </Link>
              <Link
                href="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50"
              >
                <Heart className="w-5 h-5" />
                Saved Properties
              </Link>
              <Link
                href="/list-property"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-accent-500 font-medium hover:bg-accent-50"
              >
                <Plus className="w-5 h-5" />
                List Your Property
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
