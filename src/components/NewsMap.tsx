'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NewsItem } from '@/types/news';
import { MAP_CONFIG } from '@/config/news-sources';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

import { useTranslations } from 'next-intl';

interface NewsMapProps {
  news: NewsItem[];
  onMarkerClick: (newsItems: NewsItem[]) => void;
}

export default function NewsMap({ news, onMarkerClick }: NewsMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView(
      MAP_CONFIG.center,
      MAP_CONFIG.zoom
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
    }).addTo(map);

    mapRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const t = useTranslations('map');

  // Update markers when news changes
  useEffect(() => {
    if (!markersRef.current) return;

    // Clear existing markers
    markersRef.current.clearLayers();

    // Group news by location (only those that have coordinates)
    const locationGroups = new Map<string, NewsItem[]>();

    news.filter(item => item.location).forEach(item => {
      const loc = item.location!;
      const key = `${loc.lat},${loc.lng}`;
      const existing = locationGroups.get(key) || [];
      locationGroups.set(key, [...existing, item]);
    });

    // Create markers for each location
    locationGroups.forEach((items, key) => {
      const firstItem = items[0];
      const count = items.length;
      const loc = firstItem.location!;

      // Create custom icon with count
      const iconHtml = `
        <div class="custom-marker">
          <div class="marker-pin"></div>
          <div class="marker-count">${count}</div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-marker-wrapper',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = L.marker(
        [loc.lat, loc.lng],
        { icon: customIcon }
      );

      // Create popup content with translations
      const itemsText = count === 1 ? t('newsItem') : t('newsItems');
      const viewDetailsText = t('viewDetails');

      const popupContent = `
        <div class="news-popup">
          <h3 class="popup-location">${loc.name}</h3>
          <p class="popup-count">${count} ${itemsText}</p>
          <button class="popup-button" onclick="window.dispatchEvent(new CustomEvent('marker-click', { detail: '${key}' }))">
            ${viewDetailsText}
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(markersRef.current!);

      // Store items for this marker
      marker.on('click', () => {
        onMarkerClick(items);
      });
    });

    const handlePopupClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      const key = customEvent.detail;
      const items = locationGroups.get(key);
      if (items) {
        onMarkerClick(items);
      }
    };

    window.addEventListener('marker-click', handlePopupClick);

    return () => {
      window.removeEventListener('marker-click', handlePopupClick);
    };
  }, [news, onMarkerClick, t]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg overflow-hidden shadow-2xl" />
      <style jsx global>{`
        .custom-marker-wrapper {
          background: transparent;
          border: none;
        }
        
        .custom-marker {
          position: relative;
          width: 40px;
          height: 40px;
        }
        
        .marker-pin {
          position: absolute;
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          left: 5px;
          top: 5px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .marker-count {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          color: #059669;
          font-weight: bold;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 10px;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .news-popup {
          padding: 8px;
          min-width: 200px;
        }
        
        .popup-location {
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 8px 0;
          color: #1f2937;
        }
        
        .popup-count {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 12px 0;
        }
        
        .popup-button {
          width: 100%;
          padding: 8px 16px;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .popup-button:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
