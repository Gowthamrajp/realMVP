import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">
                Real<span className="text-accent-400">MVP</span>
              </span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">
              Find your dream property across India. Free listings, map-based search, and direct owner contact.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><Link href="/properties?listing_type=sale" className="hover:text-white transition-colors">Buy Property</Link></li>
              <li><Link href="/properties?listing_type=rent" className="hover:text-white transition-colors">Rent Property</Link></li>
              <li><Link href="/properties?property_type=pg" className="hover:text-white transition-colors">PG / Co-living</Link></li>
              <li><Link href="/properties?property_type=commercial" className="hover:text-white transition-colors">Commercial</Link></li>
              <li><Link href="/list-property" className="hover:text-white transition-colors">List Your Property</Link></li>
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h3 className="font-display font-semibold mb-4">Top Cities</h3>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><Link href="/properties?city=Mumbai" className="hover:text-white transition-colors">Mumbai</Link></li>
              <li><Link href="/properties?city=Bangalore" className="hover:text-white transition-colors">Bangalore</Link></li>
              <li><Link href="/properties?city=Delhi" className="hover:text-white transition-colors">Delhi NCR</Link></li>
              <li><Link href="/properties?city=Hyderabad" className="hover:text-white transition-colors">Hyderabad</Link></li>
              <li><Link href="/properties?city=Pune" className="hover:text-white transition-colors">Pune</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-primary-200">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@realmvp.in" className="hover:text-white transition-colors">hello@realmvp.in</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+919999999999" className="hover:text-white transition-colors">+91 99999 99999</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-400/30 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-primary-300">
          <p>© 2026 RealMVP. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
