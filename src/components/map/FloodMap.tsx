"use client";
import { useEffect, useRef } from "react";
import { useHydronova } from "@/store/hydronova";

interface FloodMapProps {
  fullscreen?: boolean;
  layers?: { rivers: boolean; zones: boolean; shelters: boolean; sensors: boolean };
}

const RIVERS = [
  { name: "Surma River", nameBn: "সুরমা নদী", points: [[24.95, 91.7], [24.89, 91.87], [24.7, 92.0]] },
  { name: "Jamuna River", nameBn: "যমুনা নদী", points: [[25.4, 89.7], [24.9, 89.75], [24.0, 89.85], [23.6, 90.05]] },
  { name: "Padma River", nameBn: "পদ্মা নদী", points: [[24.3, 88.5], [23.8, 89.2], [23.4, 90.0], [23.2, 90.5]] },
  { name: "Meghna River", nameBn: "মেঘনা নদী", points: [[23.7, 90.65], [23.2, 90.75], [22.6, 90.95]] },
];

const FLOOD_ZONES = [
  { lat: 24.8949, lng: 91.8687, radius: 18000, level: "severe", district: "Sylhet" },
  { lat: 25.0658, lng: 91.395, radius: 15000, level: "high", district: "Sunamganj" },
  { lat: 24.7471, lng: 90.4203, radius: 12000, level: "moderate", district: "Mymensingh" },
  { lat: 25.209, lng: 89.945, radius: 10000, level: "moderate", district: "Jamalpur" },
  { lat: 23.8103, lng: 90.4125, radius: 8000, level: "safe", district: "Dhaka" },
];

const SHELTERS = [
  { lat: 24.8949, lng: 91.8687, name: "Sylhet Govt. Primary School", nameBn: "সিলেট সরকারি প্রাইমারি স্কুল", capacity: 450 },
  { lat: 25.0658, lng: 91.395, name: "Sunamganj Community Center", nameBn: "সুনামগঞ্জ কমিউনিটি সেন্টার", capacity: 300 },
  { lat: 24.7471, lng: 90.4203, name: "Mymensingh Cyclone Shelter", nameBn: "মাইমনসিংহ ঘূর্ণিঝড় আশ্রয়কেন্দ্র", capacity: 600 },
];

const SENSORS = [
  { lat: 24.92, lng: 91.82, level: "82cm" },
  { lat: 25.02, lng: 91.42, level: "75cm" },
  { lat: 24.78, lng: 90.46, level: "41cm" },
  { lat: 23.84, lng: 90.39, level: "22cm" },
];

const LEVEL_COLOR: Record<string, string> = {
  safe: "#22c55e",
  moderate: "#f59e0b",
  high: "#ef4444",
  severe: "#dc2626",
};

export default function FloodMap({ fullscreen = false, layers }: FloodMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const { language } = useHydronova();
  const activeLayers = layers ?? { rivers: true, zones: true, shelters: true, sensors: true };

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setInterval>;

    function init() {
      const L = (window as any).L;
      if (!L) return false;
      if (!mapRef.current || cancelled) return true;
      if (mapInstance.current) return true;

      const map = L.map(mapRef.current, {
        center: [24.5, 90.5],
        zoom: 7,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Rivers
      if (activeLayers.rivers) {
        RIVERS.forEach((river) => {
          const line = L.polyline(river.points, {
            color: "#38bdf8",
            weight: 3,
            opacity: 0.75,
          }).addTo(map);
          line.bindPopup(`<b>${language === "bn" ? river.nameBn : river.name}</b>`);
        });
      }

      // Flood zones
      if (activeLayers.zones) {
        FLOOD_ZONES.forEach((zone) => {
          const color = LEVEL_COLOR[zone.level];
          L.circle([zone.lat, zone.lng], {
            radius: zone.radius,
            color,
            fillColor: color,
            fillOpacity: 0.18,
            weight: 1.5,
          })
            .addTo(map)
            .bindPopup(`<b>${zone.district}</b><br/>Risk: ${zone.level}`);
        });
      }

      // Shelters
      if (activeLayers.shelters) {
        SHELTERS.forEach((shelter) => {
          const icon = L.divIcon({
            html: `<div style="background:#0ea5e9;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 8px rgba(14,165,233,0.8)"></div>`,
            className: "",
            iconSize: [14, 14],
          });
          L.marker([shelter.lat, shelter.lng], { icon })
            .addTo(map)
            .bindPopup(`<b>${language === "bn" ? shelter.nameBn : shelter.name}</b><br/>Capacity: ${shelter.capacity}`);
        });
      }

      // Sensors
      if (activeLayers.sensors) {
        SENSORS.forEach((sensor) => {
          const icon = L.divIcon({
            html: `<div style="background:#7dd3fc;width:8px;height:8px;border-radius:50%;border:1px solid white"></div>`,
            className: "",
            iconSize: [8, 8],
          });
          L.marker([sensor.lat, sensor.lng], { icon })
            .addTo(map)
            .bindPopup(`Water level: ${sensor.level}`);
        });
      }

      mapInstance.current = map;
      return true;
    }

    if (!init()) {
      retryTimer = setInterval(() => {
        if (init()) clearInterval(retryTimer);
      }, 200);
    }

    return () => {
      cancelled = true;
      if (retryTimer) clearInterval(retryTimer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: fullscreen ? "calc(100dvh - 112px)" : "100%",
        background: "#03152e",
      }}
    />
  );
}
