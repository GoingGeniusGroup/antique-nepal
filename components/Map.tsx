"use client";

import {
  createLeafletContext,
  LeafletContext,
  type LeafletContextInterface,
} from "@react-leaflet/core";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { Marker, Popup, TileLayer } from "react-leaflet";

Reflect.deleteProperty(L.Icon.Default.prototype, "_getIconUrl");
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const storeLocation: [number, number] = [27.6118517, 85.2620071];

const leafletImageBaseUrl =
  "https://unpkg.com/leaflet@1.9.4/dist/images/";

const storeIcon = L.icon({
  iconUrl: `${leafletImageBaseUrl}marker-icon.png`,
  iconRetinaUrl: `${leafletImageBaseUrl}marker-icon-2x.png`,
  shadowUrl: `${leafletImageBaseUrl}marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

type MapLifecycle = {
  map: L.Map;
  teardownTimer: ReturnType<typeof setTimeout> | null;
};

const mapLifecycles = new WeakMap<HTMLDivElement, MapLifecycle>();

export default function StoreMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [context, setContext] = useState<LeafletContextInterface | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      throw new Error("Leaflet map container was not mounted.");
    }

    let lifecycle = mapLifecycles.get(container);
    if (
      lifecycle?.teardownTimer !== null &&
      lifecycle?.teardownTimer !== undefined
    ) {
      clearTimeout(lifecycle.teardownTimer);
      lifecycle.teardownTimer = null;
    }

    if (!lifecycle) {
      const map = L.map(container, { scrollWheelZoom: false }).setView(
        storeLocation,
        16,
      );
      lifecycle = { map, teardownTimer: null };
      mapLifecycles.set(container, lifecycle);
    }

    setContext(createLeafletContext(lifecycle.map));

    return () => {
      const lifecycleToRemove = mapLifecycles.get(container);
      if (!lifecycleToRemove) return;

      lifecycleToRemove.teardownTimer = setTimeout(() => {
        if (mapLifecycles.get(container) !== lifecycleToRemove) return;

        lifecycleToRemove.map.remove();
        mapLifecycles.delete(container);
      }, 0);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-64 w-full overflow-hidden rounded-2xl border border-border shadow-sm"
    >
      {context && (
        <LeafletContext.Provider value={context}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            key="samjhana-store-marker"
            position={storeLocation}
            icon={storeIcon}
            autoPanOnFocus={false}
          >
            <Popup>
              <strong>Samjhana Ladies Shop</strong>
              <br />
              Narayan Dabli, Kathmandu, Bagmati Province 00446
            </Popup>
          </Marker>
        </LeafletContext.Provider>
      )}
    </div>
  );
}
