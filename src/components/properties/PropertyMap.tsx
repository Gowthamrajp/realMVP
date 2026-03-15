'use client';

import { useEffect, useRef, useState } from 'react';
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
  const streetLayerRef = useRef<L.TileLayer | null>(null);
  const satelliteLayerRef = useRef<L.TileLayer | null>(null);
  const labelsLayerRef = useRef<L.TileLayer | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);

  // Invalidate map size and re-fit bounds when visibility changes
  useEffect(() => {
    if (visible && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
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

    // Street layer — OpenStreetMap (original)
    streetLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Satellite layer (ESRI World Imagery — free, no API key)
    satelliteLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri, Maxar, Earthstar Geographics',
      maxZoom: 19,
    });

    // Labels overlay for satellite — Voyager labels (roads, areas, water, railways)
    labelsLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 20,
      subdomains: 'abcd',
      pane: 'overlayPane',
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle between street and satellite (with labels overlay)
  useEffect(() => {
    if (!mapRef.current || !streetLayerRef.current || !satelliteLayerRef.current || !labelsLayerRef.current) return;

    if (isSatellite) {
      mapRef.current.removeLayer(streetLayerRef.current);
      mapRef.current.addLayer(satelliteLayerRef.current);
      mapRef.current.addLayer(labelsLayerRef.current); // Add road/area labels on top
    } else {
      mapRef.current.removeLayer(satelliteLayerRef.current);
      mapRef.current.removeLayer(labelsLayerRef.current);
      mapRef.current.addLayer(streetLayerRef.current);
    }
  }, [isSatellite]);

  // Track if initial bounds have been set
  const initialBoundsSet = useRef(false);

  // Create/update markers when properties change
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

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

      marker.bindTooltip(
        `<div style="font-weight:600;font-size:13px;margin-bottom:2px;">${property.title}</div>
         <div style="color:#64748b;font-size:11px;">${property.address}, ${property.city}</div>`,
        { direction: 'top', offset: [0, -10] }
      );

      markersRef.current.set(property.id, marker);
    });

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
          el.style.zIndex = '10000';
        } else {
          priceDiv.classList.remove('active');
          el.style.zIndex = '';
        }
      }
    });
  }, [activeId]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map type toggle button */}
      <button
        onClick={() => setIsSatellite(!isSatellite)}
        className="map-toggle-btn"
        title={isSatellite ? 'Switch to Street View' : 'Switch to Satellite View'}
      >
        <span className="map-toggle-icon">{isSatellite ? '🗺️' : '🛰️'}</span>
        <span className="map-toggle-label">{isSatellite ? 'Map' : 'Satellite'}</span>
      </button>
    </div>
  );
}
