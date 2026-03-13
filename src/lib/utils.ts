import { ListingType } from '@/types';

export function formatPrice(price: number, listingType: ListingType): string {
  if (listingType === 'rent' || listingType === 'lease' || listingType === 'pg') {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L/mo`;
    }
    if (price >= 1000) {
      return `₹${(price / 1000).toFixed(0)}K/mo`;
    }
    return `₹${price}/mo`;
  }

  // Sale prices
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)}Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(0)}L`;
  }
  if (price >= 1000) {
    return `₹${(price / 1000).toFixed(0)}K`;
  }
  return `₹${price}`;
}

export function formatPriceDetailed(price: number, listingType: ListingType): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

  if (listingType === 'rent' || listingType === 'lease' || listingType === 'pg') {
    return `${formatted}/month`;
  }
  return formatted;
}

export function formatArea(sqft: number): string {
  return `${new Intl.NumberFormat('en-IN').format(sqft)} sq.ft`;
}

export function getListingTypeLabel(type: ListingType): string {
  const labels: Record<ListingType, string> = {
    sale: 'For Sale',
    rent: 'For Rent',
    lease: 'For Lease',
    pg: 'PG',
  };
  return labels[type];
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    apartment: 'Apartment',
    house: 'House',
    villa: 'Villa',
    plot: 'Plot',
    pg: 'PG / Co-living',
    commercial: 'Commercial',
    office: 'Office Space',
    shop: 'Shop',
  };
  return labels[type] || type;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function timeAgo(date: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ];

  for (const [secondsInInterval, label] of intervals) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return `${interval} ${label}${interval > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}
