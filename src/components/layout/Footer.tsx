import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">🏛</span>
              <h2 className="text-xl font-black uppercase tracking-tighter">RealEstateIndia</h2>
            </div>
            <p className="text-white/50 text-xs uppercase tracking-widest leading-relaxed max-w-sm">
              The premier destination for premium real estate in India. From heritage villas to futuristic skyscrapers, we bring you closer to your dream home.
            </p>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] mb-6 text-white/40">Navigation</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><Link href="/" className="hover:text-white/70">Home</Link></li>
              <li><Link href="/properties" className="hover:text-white/70">Listings</Link></li>
              <li><Link href="/favorites" className="hover:text-white/70">Saved</Link></li>
              <li><Link href="/list-property" className="hover:text-white/70">Post Property</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] mb-6 text-white/40">Connect</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-white/70">Instagram</a></li>
              <li><a href="#" className="hover:text-white/70">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white/70">Twitter</a></li>
              <li><a href="#" className="hover:text-white/70">Newsletter</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-widest text-white/30">© 2026 RealEstateIndia. All rights reserved.</p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-white/30 font-bold">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
