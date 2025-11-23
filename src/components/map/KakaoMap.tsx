import React, { useEffect, useRef } from "react";

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
}

// Kakao Maps SDK 타입 정의
interface KakaoMapsLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoMapsMap {
  setCenter(latlng: KakaoMapsLatLng): void;
  setLevel(level: number): void;
  getLevel(): number;
  getCenter(): KakaoMapsLatLng;
}

interface KakaoMapsMarker {
  setMap(map: KakaoMapsMap | null): void;
  getPosition(): KakaoMapsLatLng;
}

interface KakaoMapsInfoWindow {
  open(map: KakaoMapsMap, marker: KakaoMapsMarker): void;
  close(): void;
}

interface KakaoMapsEvent {
  addListener(
    target: KakaoMapsMarker,
    eventType: string,
    handler: () => void
  ): void;
}

interface KakaoMapsNamespace {
  LatLng: new (lat: number, lng: number) => KakaoMapsLatLng;
  Map: new (container: HTMLElement, options: {
    center: KakaoMapsLatLng;
    level: number;
  }) => KakaoMapsMap;
  Marker: new (options: {
    position: KakaoMapsLatLng;
    title?: string;
  }) => KakaoMapsMarker;
  InfoWindow: new (options: {
    content: string;
  }) => KakaoMapsInfoWindow;
  event: KakaoMapsEvent;
  load(callback: () => void): void;
}

interface KakaoSDK {
  maps: KakaoMapsNamespace;
}

declare global {
  interface Window {
    kakao: KakaoSDK;
  }
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  latitude,
  longitude,
  title,
  address,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMapsMap | null>(null);

  useEffect(() => {

    const loadKakaoMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error("Kakao Maps SDK is not loaded");
        return;
      }

      if (!mapContainer.current) {
        console.error("Map container is not available");
        return;
      }

      try {
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3, // 확대 레벨
        };

        const map = new window.kakao.maps.Map(mapContainer.current, options);
        mapRef.current = map;

        const markerPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        const infowindowContent = `
          <div style="padding: 10px; width: 250px; max-width: 250px; text-align: center; box-sizing: border-box;">
            <div style="font-weight: bold; margin-bottom: 5px; word-break: break-all; overflow-wrap: break-word; white-space: normal;">${title}</div>
            ${
              address
                ? `<div style="font-size: 12px; color: #666; word-break: break-all; overflow-wrap: break-word; white-space: normal;">${address}</div>`
                : ""
            }
          </div>
        `;

        const infowindow = new window.kakao.maps.InfoWindow({
          content: infowindowContent,
        });

        window.kakao.maps.event.addListener(marker, "mouseover", () => {
          infowindow.open(map, marker);
        });

        window.kakao.maps.event.addListener(marker, "mouseout", () => {
          infowindow.close();
        });

        infowindow.open(map, marker);
      } catch (error) {
        console.error("Error initializing Kakao Map:", error);
      }
    };

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(loadKakaoMap);
    } else {
      const checkKakao = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkKakao);
          window.kakao.maps.load(loadKakaoMap);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkKakao);
        console.error("Kakao SDK loading timeout");
      }, 10000);
    }
  }, [latitude, longitude, title, address]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-lg"
      style={{ minHeight: "400px" }}
    />
  );
};

export default KakaoMap;
