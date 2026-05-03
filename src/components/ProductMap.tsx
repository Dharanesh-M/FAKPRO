import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ProductEvent } from "@/contexts/ProductContext";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export function ProductMap({ events }: { events: ProductEvent[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || events.length === 0) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    const map = L.map(mapRef.current).setView([events[0].location.lat, events[0].location.lng], 3);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const points: L.LatLngExpression[] = [];

    events.forEach((event, idx) => {
      const { lat, lng, name } = event.location;
      points.push([lat, lng]);

      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(`
        <div style="font-family: Manrope, sans-serif; font-size: 12px;">
          <strong>${event.action}</strong><br/>
          <span style="color: #666;">${event.role} • ${name}</span><br/>
          <span style="color: #999; font-size: 10px;">${new Date(event.timestamp).toLocaleString()}</span>
        </div>
      `);

      // Number label
      const icon = L.divIcon({
        className: "",
        html: `<div style="background: hsl(215 60% 24%); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; font-family: Sora; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">${idx + 1}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      L.marker([lat, lng], { icon }).addTo(map);
    });

    if (points.length > 1) {
      L.polyline(points, { color: "hsl(200 45% 45%)", weight: 2, dashArray: "8 4", opacity: 0.7 }).addTo(map);
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    }

    return () => { map.remove(); mapInstance.current = null; };
  }, [events]);

  return <div ref={mapRef} className="h-[350px] md:h-[450px] rounded-lg border" />;
}
