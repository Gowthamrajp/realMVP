'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '@/types';
import { formatPrice } from '@/lib/utils';

interface PropertyMapProps {
  properties: Property[];
  activeId: string | null;
  onMarkerClick?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  visible?: boolean;
}

export default function PropertyMap({
  properties,
  activeId,
  onMarkerClick,
  center = [20.5937, 78.9629],
  zoom = 5,
  visible = true,
}: PropertyMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Invalidate map size and re-fit bounds when visibility changes
  useEffect(() => {
    if (visible && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
        // Re-fit bounds to show all markers properly
        if (properties.length > 0) {
          const bounds = L.latLngBounds(
            properties.map((p) => [p.latitude, p.longitude])
          );
          mapRef.current?.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
        }
      }, 150);
    }
  }, [visible, properties]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track if initial bounds have been set
  const initialBoundsSet = useRef(false);

  // Create/update markers when properties change (NOT on activeId change)
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Add new markers
    properties.forEach((property) => {
      const priceText = formatPrice(property.price, property.listing_type);

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="price-marker">${priceText}</div>`,
        iconSize: [0, 0],
        iconAnchor: [40, 20],
      });

      const marker = L.marker([property.latitude, property.longitude], { icon })
        .addTo(mapRef.current!);

      marker.on('click', () => {
        onMarkerClick?.(property.id);
      });

      // Tooltip on hover
      marker.bindTooltip(
        `<div style="font-weight:600;font-size:13px;margin-bottom:2px;">${property.title}</div>
         <div style="color:#64748b;font-size:11px;">${property.address}, ${property.city}</div>`,
        { direction: 'top', offset: [0, -10] }
      );

      markersRef.current.set(property.id, marker);
    });

    // Only fit bounds on first load or when properties list changes
    if (properties.length > 0 && !initialBoundsSet.current) {
      const bounds = L.latLngBounds(
        properties.map((p) => [p.latitude, p.longitude])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      initialBoundsSet.current = true;
    }
  }, [properties, onMarkerClick]);

  // Update active marker styling + bring to front
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      if (!el) return;
      const priceDiv = el.querySelector('.price-marker');
      if (priceDiv) {
        if (id === activeId) {
          priceDiv.classList.add('active');
          // Bring marker to front
          el.style.zIndex = '10000';
        } else {
          priceDiv.classList.remove('active');
          el.style.zIndex = '';
        }
      }
    });
  }, [activeId]);

  return (
    <div ref={mapContainerRef} className="w-full h-full rounded-2xl overflow-hidden" />
  );
}
