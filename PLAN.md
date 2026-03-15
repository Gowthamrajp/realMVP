# 🏡 RealMVP — Real Estate Platform

## Project Overview

A next-generation, Airbnb-style real estate platform for the Indian market. Map-first UI, supporting all property types (Buy/Rent/Lease/Commercial/PG), free for all users. Built with modern web technologies for $0/month infrastructure.

**Vision**: Start lean, make high-value features free, and monetize through alternative revenue streams.

---

## 📋 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Features — MVP](#features--mvp)
6. [Features — Future](#features--future)
7. [Implementation Phases](#implementation-phases)
8. [Cost Breakdown](#cost-breakdown)
9. [Environment Variables](#environment-variables)
10. [Development Setup](#development-setup)
11. [Deployment](#deployment)

---

## 🛠 Tech Stack

| Layer | Technology | Cost | Why |
|-------|-----------|------|-----|
| **Frontend** | Next.js 14 (App Router) | $0 | SSR, SEO, React ecosystem |
| **Styling** | Tailwind CSS | $0 | Utility-first, fast development |
| **Backend** | Supabase (BaaS) | $0 | PostgreSQL + Auth + Storage + API |
| **Database** | PostgreSQL (via Supabase) | $0 | Relational, supports geo queries |
| **Maps** | OpenStreetMap + Leaflet.js | $0 | 100% free, no API key needed |
| **Images** | Supabase Storage + Cloudinary | $0 | Auto-compression, CDN |
| **Auth** | Supabase Auth | $0 | Google OAuth, Magic Links |
| **Hosting** | Vercel | $0 | CDN, SSL, auto-deploy |
| **Analytics** | Plausible / Google Analytics | $0 | Privacy-friendly |
| **PWA** | next-pwa | $0 | Installable, offline support |
| **Icons** | Lucide React | $0 | Beautiful, consistent icons |
| **State** | Zustand | $0 | Lightweight state management |

**Total Monthly Cost: $0** (free tiers cover MVP traffic)

---

## 🏗 Architecture

```
User (Web / Mobile PWA)
        │
   Next.js Frontend (Vercel)
        │
   Supabase API (auto-generated)
        │
   PostgreSQL Database
        │
   ┌────┴────┐
   │         │
OpenStreetMap  Supabase Storage
 (Leaflet)    (Property Images)
```

**Key Principles:**
- Monolithic full-stack app (no microservices)
- Server-side rendering for SEO
- Client-side interactivity for maps and search
- Backend-as-a-Service (no server management)
- Progressive Web App (installable on phones)

---

## 📁 Project Structure

```
realMVP/
├── public/
│   ├── icons/                    # PWA icons (192x192, 512x512)
│   ├── manifest.json             # PWA manifest
│   └── images/                   # Static images
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout (fonts, metadata, providers)
│   │   ├── page.tsx              # Home page (hero + search + map)
│   │   ├── globals.css           # Tailwind + custom styles
│   │   ├── properties/
│   │   │   ├── page.tsx          # Listings page (split: list + map)
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Property detail page
│   │   ├── list-property/
│   │   │   └── page.tsx          # Add property form
│   │   ├── favorites/
│   │   │   └── page.tsx          # Saved properties
│   │   ├── auth/
│   │   │   ├── login/page.tsx    # Login page
│   │   │   └── callback/route.ts # OAuth callback
│   │   └── api/                  # API routes (if needed)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx        # Top navigation bar
│   │   │   ├── Footer.tsx        # Footer
│   │   │   └── MobileNav.tsx     # Bottom mobile navigation
│   │   ├── home/
│   │   │   ├── HeroSearch.tsx    # Hero section with search
│   │   │   ├── FeaturedListings.tsx
│   │   │   └── CategoryCards.tsx # Buy/Rent/PG/Commercial cards
│   │   ├── properties/
│   │   │   ├── PropertyCard.tsx  # Listing card (image carousel)
│   │   │   ├── PropertyGrid.tsx  # Grid of cards
│   │   │   ├── PropertyFilters.tsx # Filter sidebar/sheet
│   │   │   ├── PropertyMap.tsx   # Leaflet map with markers
│   │   │   └── MapMarker.tsx     # Custom price marker
│   │   ├── property-detail/
│   │   │   ├── ImageGallery.tsx  # Photo gallery/carousel
│   │   │   ├── PropertyInfo.tsx  # Details, amenities
│   │   │   ├── ContactOwner.tsx  # Inquiry form
│   │   │   └── LocationMap.tsx   # Single property map
│   │   ├── auth/
│   │   │   └── AuthModal.tsx     # Login/signup modal
│   │   └── ui/                   # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Badge.tsx
│   │       ├── Modal.tsx
│   │       └── Skeleton.tsx      # Loading skeletons
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser Supabase client
│   │   │   ├── server.ts         # Server Supabase client
│   │   │   └── middleware.ts     # Auth middleware
│   │   ├── utils.ts              # Helper functions
│   │   └── constants.ts          # App constants, enums
│   ├── hooks/
│   │   ├── useProperties.ts     # Property data fetching
│   │   ├── useFavorites.ts      # Favorites logic
│   │   └── useAuth.ts           # Auth state hook
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   └── data/
│       └── mockProperties.ts    # Seed/mock data (50 properties)
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Database schema
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.local                    # Environment variables (gitignored)
├── .env.local.example            # Template for env vars
├── .gitignore
├── PLAN.md                       # This file
└── README.md
```

---

## 🗄 Database Schema

### `profiles` (extends Supabase auth.users)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK, FK → auth.users) | User ID |
| full_name | text | Full name |
| phone | text | Phone number |
| avatar_url | text | Profile picture URL |
| role | enum | owner, broker, buyer, tenant |
| city | text | User's city |
| created_at | timestamptz | Account creation date |
| updated_at | timestamptz | Last update |

### `properties`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Property ID |
| title | text | Listing title |
| description | text | Detailed description |
| property_type | enum | apartment, house, villa, plot, pg, commercial, office, shop |
| listing_type | enum | sale, rent, lease, pg |
| price | numeric | Price amount |
| price_unit | enum | total, per_sqft, per_month |
| bedrooms | int | Number of bedrooms |
| bathrooms | int | Number of bathrooms |
| area_sqft | numeric | Area in square feet |
| furnishing | enum | furnished, semi, unfurnished |
| address | text | Full address |
| city | text | City name |
| state | text | State name |
| pincode | text | PIN code |
| latitude | float8 | GPS latitude |
| longitude | float8 | GPS longitude |
| images | text[] | Array of image URLs |
| amenities | text[] | Array: parking, gym, pool, etc. |
| owner_id | uuid (FK → profiles) | Property owner |
| is_verified | boolean | Verified listing flag |
| is_active | boolean | Active/hidden flag |
| created_at | timestamptz | Listing creation date |
| updated_at | timestamptz | Last update |

### `favorites`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Favorite ID |
| user_id | uuid (FK → profiles) | User who favorited |
| property_id | uuid (FK → properties) | Favorited property |
| created_at | timestamptz | When favorited |

### `inquiries`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Inquiry ID |
| property_id | uuid (FK → properties) | Property inquired about |
| sender_id | uuid (FK → profiles) | Who sent the inquiry |
| message | text | Inquiry message |
| phone | text | Contact phone |
| status | enum | pending, responded, closed |
| created_at | timestamptz | When sent |

---

## ✅ Features — MVP (v1.0)

### 🏠 Home Page
- [x] Hero section with full-width search bar
- [x] Search by: location, property type, budget range
- [x] Category cards (Buy, Rent, PG, Commercial)
- [x] Featured listings carousel
- [x] "Explore on Map" call-to-action
- [x] Responsive design (mobile-first)

### 🗺 Property Listings (Airbnb-style)
- [x] Split view: scrollable cards (left) + interactive map (right)
- [x] OpenStreetMap with Leaflet.js
- [x] Custom price markers on map (₹25L, ₹15K/mo)
- [x] Click marker ↔ highlight card interaction
- [x] Filter bar: City, Price Range, Bedrooms, Property Type, Listing Type
- [x] Mobile: toggle between list view and map view

### 🏢 Property Detail Page
- [x] Image gallery with lightbox
- [x] Property details (price, area, bedrooms, bathrooms, furnishing)
- [x] Amenities grid with icons
- [x] Location map (single marker)
- [x] Contact owner / inquiry form
- [x] Similar properties section

### 🔐 Authentication
- [x] Google OAuth login
- [x] Email magic link login
- [x] User profiles
- [x] Protected routes (favorites, list property)

### ❤️ Favorites
- [x] Heart icon toggle on property cards
- [x] Saved properties page
- [x] Synced across devices (via Supabase)

### ➕ List Property
- [x] Multi-step property submission form
- [x] Image upload (multiple photos)
- [x] Location picker on map
- [x] Property type, amenities, details

### 🔍 Search & Filters
- [x] PostgreSQL-powered filtering
- [x] Price range slider
- [x] Bedrooms selector
- [x] City/location filter
- [x] Property type filter
- [x] Listing type filter (buy/rent/lease/pg)

### 📱 PWA
- [x] Installable on phones (Add to Home Screen)
- [x] Offline page support
- [x] App-like experience
- [x] Custom splash screen and icons

---

## 🔮 Features — Future (v2.0+)

### Phase 2 — Growth
- [ ] Admin dashboard (approve listings, analytics)
- [ ] Advanced search (Elasticsearch)
- [ ] AI-powered price estimation
- [ ] Virtual tours (360° photos)
- [ ] Neighborhood insights (schools, hospitals, transit)
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Chat between buyer and seller
- [ ] Document verification
- [ ] EMI calculator
- [ ] Property comparison tool

### Phase 3 — Scale
- [ ] Native mobile apps (React Native)
- [ ] PostGIS for geo-spatial queries
- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Broker dashboard
- [ ] Premium listing packages (monetization)
- [ ] Featured listings (monetization)
- [ ] Lead generation tools (monetization)
- [ ] Analytics for property owners

---

## 🚀 Implementation Phases

### Phase 1: Project Setup (~15 min)
- Initialize Next.js 14 with App Router + TypeScript + Tailwind
- Install all dependencies
- Configure Tailwind theme (colors, fonts)
- Set up environment variables
- PWA manifest configuration

### Phase 2: Core Layout & UI Components (~30 min)
- Root layout with fonts and metadata
- Navbar (logo, search, auth button)
- Mobile bottom navigation
- Footer
- Reusable UI components (Button, Input, Badge, Modal, Skeleton)

### Phase 3: Home Page (~30 min)
- Hero section with search bar
- Category cards
- Featured listings carousel
- Responsive design

### Phase 4: Properties Page — Airbnb Style (~45 min)
- Split view layout
- Property cards with image carousel
- OpenStreetMap integration with Leaflet
- Custom price markers
- Filter bar
- Card ↔ marker interaction

### Phase 5: Property Detail Page (~30 min)
- Image gallery
- Property information layout
- Amenities grid
- Location map
- Contact form
- Similar properties

### Phase 6: Supabase Integration (~30 min)
- Database schema migration
- Client configuration
- Auth setup (Google + Magic Link)
- Row Level Security policies
- Mock data seeding

### Phase 7: Auth Flow (~20 min)
- Login modal
- Auth state management
- Protected routes
- User profile display

### Phase 8: Interactive Features (~30 min)
- Add property form
- Favorites system
- Inquiry form
- Search with filters

### Phase 9: PWA & Polish (~15 min)
- Service worker
- Offline support
- Loading states
- Error handling
- Final responsive testing

---

## 💰 Cost Breakdown

### MVP Phase ($0/month)

| Service | Free Tier Limits | Cost |
|---------|-----------------|------|
| **Vercel** | 100GB bandwidth, unlimited deploys | $0 |
| **Supabase** | 500MB DB, 1GB storage, 50K auth users | $0 |
| **OpenStreetMap** | Unlimited map loads | $0 |
| **Cloudinary** | 25GB bandwidth, auto-compression | $0 |
| **GitHub** | Unlimited repos | $0 |
| **Google Analytics** | Unlimited | $0 |
| **Total** | | **$0/month** |

### Growth Phase (when needed)

| Service | Paid Plan | Cost |
|---------|----------|------|
| Vercel Pro | More bandwidth | $20/mo |
| Supabase Pro | 8GB DB, 100GB storage | $25/mo |
| Cloudinary Plus | More bandwidth | $89/mo |
| **Total** | | **~$134/month** |

---

## 🔑 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://mrxerotfgertnaecfhcq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=RealMVP

# Optional: Cloudinary (for image optimization)
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 💻 Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/realMVP.git
cd realMVP

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Auto-deploys on every push to `main`

### Manual
```bash
npm run build
npm start
```

---

## 🎨 Design System

### Colors
- **Primary**: `#1e3a5f` (Deep Blue) — Trust, professionalism
- **Accent**: `#ff5a5f` (Coral Red) — Airbnb-inspired, action items
- **Success**: `#10b981` (Emerald)
- **Warning**: `#f59e0b` (Amber)
- **Background**: `#f8fafc` (Slate 50)
- **Card**: `#ffffff` (White)
- **Text**: `#1e293b` (Slate 800)
- **Muted**: `#64748b` (Slate 500)

### Typography
- **Headings**: Poppins (600, 700)
- **Body**: Inter (400, 500, 600)

### Components
- Rounded corners (`rounded-xl` for cards, `rounded-full` for buttons)
- Subtle shadows (`shadow-sm` to `shadow-lg`)
- Smooth transitions (300ms)
- Mobile-first breakpoints

### Map Markers
- Pill-shaped price badges
- ₹25L / ₹15K/mo format
- Active state: scaled up, accent color
- Hover state: slight elevation

---

## 📊 Mock Data Strategy

50 properties seeded across major Indian cities:
- **Cities**: Mumbai, Bangalore, Delhi NCR, Hyderabad, Chennai, Pune
- **Types**: Apartments, Houses, Villas, Plots, PG, Commercial
- **Prices**: ₹25L–₹5Cr (sale), ₹8K–₹1.5L/mo (rent)
- **Coordinates**: Real GPS coordinates for accurate map placement
- **Images**: Placeholder images from picsum.photos

Mock data will be replaced with real user-submitted data as the platform grows.

---

## 📝 Status Tracker

| Phase | Status | Notes |
|-------|--------|-------|
| Project Setup | ✅ Complete | Next.js 14 + TypeScript + Tailwind |
| Core Layout & UI | ✅ Complete | B&W brutalist design from Stitch |
| Home Page | ✅ Complete | Hero, search, featured, why choose |
| Properties Page | ✅ Complete | Airbnb-style map + bottom sheet |
| Property Detail | ✅ Complete | Gallery, amenities, inquiry form |
| Supabase Integration | ✅ Schema Live | 4 tables with RLS policies |
| Auth Flow | ⚡ Ready | Configured, needs Google OAuth |
| Interactive Features | ✅ Complete | Favorites, filters, map toggle |
| PWA & Polish | ✅ Complete | Manifest, icons configured |
| Deployment | ✅ Live | Vercel + GitHub CI/CD |
| Design Migration | ✅ Complete | B&W brutalist from Google Stitch |
| Satellite Map | ✅ Complete | ESRI imagery + dual overlay (labels + roads) |
| Map Tiles | ✅ Complete | OpenStreetMap street + ESRI satellite |
| Mobile Bottom Nav | ✅ Complete | SVG icons, active states |
| Supabase Form Submit | ✅ Complete | List property → uploads photos → inserts row → redirects |
| Live Data Fetch | ✅ Complete | Properties page + detail page read from Supabase + mock fallback |
| Null Safety | ✅ Complete | Handles null lat/lng, owner_id, empty images on detail page |

### Live URLs
- **Website**: https://real-mvp-ten.vercel.app
- **GitHub**: https://github.com/Gowthamrajp/realMVP
- **Supabase**: https://mrxerotfgertnaecfhcq.supabase.co

---

## 🗺 Map Implementation Details

### Layers (PropertyMap.tsx)
The map uses **Leaflet.js** with a toggle between Street and Satellite views:

**Street Mode (default):**
- OpenStreetMap tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`)

**Satellite Mode (toggle):**
Three layers stacked together for a Google Maps-like satellite experience:
1. **Esri World Imagery** (base satellite tiles)
   `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
2. **Esri World Transportation** (roads overlay)
   `https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}`
3. **Esri World Boundaries and Places** (locality names, city names, boundaries)
   `https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`

All layers are free (no API key), served via Esri ArcGIS Online.

### Map Features
- Custom price markers (₹25L, ₹15K/mo pill badges)
- Click marker ↔ highlight card interaction
- Null coordinate filtering (Supabase properties without lat/lng are excluded from map)
- Mobile: full-screen map with draggable bottom sheet
- Desktop: split view (cards left, map right)

---

## 🔌 Supabase Integration

### List Property Form (`/list-property`)
- 3-step form: Basic Info → Location/Amenities → Photos
- All inputs wired to React state via `updateForm()` helper
- On submit:
  1. Uploads photos to `property-images` storage bucket (unique filenames)
  2. Gets public URLs for each uploaded image
  3. Inserts property row into `properties` table
  4. Redirects to `/properties/{new-id}` on success
  5. Shows toast error on failure
- Submit button shows "Publishing..." disabled state during submission
- Anonymous INSERT policy on properties table (no auth required for MVP)

### Properties Listing (`/properties`)
- Fetches from Supabase on mount via `useEffect`
- Merges Supabase results (newest first) with mock data (deduped by ID)
- Falls back to mock data if Supabase returns empty

### Property Detail (`/properties/[id]`)
- First checks mock data by ID
- If not found, fetches from Supabase by UUID
- Shows loading state while fetching
- Handles null safety: owner_id, latitude/longitude, empty images array
- Map section only renders when coordinates exist

### Storage
- Bucket: `property-images` (public, INSERT policy)
- Files uploaded with unique names: `{timestamp}-{random}.{ext}`
- Public URLs used in `images` TEXT[] column

---

*Last Updated: March 15, 2026*
*Version: 0.3.0-supabase-integration*
