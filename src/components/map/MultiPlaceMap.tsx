import React, { useEffect, useRef } from "react";

interface Place {
  placeId: string;
  title: string;
  lat: number;
  lng: number;
  address?: string;
}

interface MultiPlaceMapProps {
  places: Place[];
  selectedPlaceIds?: string[];
  onPlaceClick?: (placeId: string) => void;
  showRoute?: boolean;
}

declare global {
  interface Window {
    kakao: any;
  }
}

const MultiPlaceMap: React.FC<MultiPlaceMapProps> = ({
  places,
  selectedPlaceIds = [],
  onPlaceClick,
  showRoute = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

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
        console.log(
          "Initializing Multi-Place Kakao Map with",
          places.length,
          "places"
        );

        // 지도 중심 계산 (모든 장소의 평균 위치)
        let centerLat = 0;
        let centerLng = 0;

        if (places.length > 0) {
          places.forEach((place) => {
            centerLat += place.lat;
            centerLng += place.lng;
          });
          centerLat /= places.length;
          centerLng /= places.length;
        } else {
          // 기본값: 서울 시청
          centerLat = 37.5665;
          centerLng = 126.978;
        }

        const options = {
          center: new window.kakao.maps.LatLng(centerLat, centerLng),
          level: 8,
        };

        const map = new window.kakao.maps.Map(mapContainer.current, options);
        mapRef.current = map;
        console.log("Map created successfully");

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        places.forEach((place, index) => {
          const markerPosition = new window.kakao.maps.LatLng(
            place.lat,
            place.lng
          );

          const isSelected = selectedPlaceIds.includes(place.placeId);

          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            title: place.title,
          });

          marker.setMap(map);
          markersRef.current.push(marker);

          const infowindowContent = `
            <div style="padding: 10px; min-width: 150px; text-align: center; ${
              isSelected
                ? "background: #fef2f2; border: 2px solid #ef4444;"
                : ""
            }">
              <div style="font-weight: bold; margin-bottom: 5px; color: ${
                isSelected ? "#ef4444" : "#000"
              };">
                ${isSelected ? "✓ " : ""}${index + 1}. ${place.title}
              </div>
              ${
                place.address
                  ? `<div style="font-size: 12px; color: #666;">${place.address}</div>`
                  : ""
              }
            </div>
          `;

          const infowindow = new window.kakao.maps.InfoWindow({
            content: infowindowContent,
          });

          window.kakao.maps.event.addListener(marker, "click", () => {
            if (onPlaceClick) {
              onPlaceClick(place.placeId);
            }
          });

          window.kakao.maps.event.addListener(marker, "mouseover", () => {
            infowindow.open(map, marker);
          });

          window.kakao.maps.event.addListener(marker, "mouseout", () => {
            infowindow.close();
          });
        });

        if (showRoute && places.length > 1) {
          if (polylineRef.current) {
            polylineRef.current.setMap(null);
          }

          const linePath = places.map(
            (place) => new window.kakao.maps.LatLng(place.lat, place.lng)
          );

          const polyline = new window.kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 4,
            strokeColor: "#ef4444",
            strokeOpacity: 0.8,
            strokeStyle: "solid",
          });

          polyline.setMap(map);
          polylineRef.current = polyline;
        } else if (polylineRef.current) {
          polylineRef.current.setMap(null);
          polylineRef.current = null;
        }

        if (places.length > 0) {
          const bounds = new window.kakao.maps.LatLngBounds();
          places.forEach((place) => {
            bounds.extend(new window.kakao.maps.LatLng(place.lat, place.lng));
          });
          map.setBounds(bounds);
        }

        console.log("All markers created successfully");
      } catch (error) {
        console.error("Error initializing Multi-Place Kakao Map:", error);
      }
    };

    if (window.kakao && window.kakao.maps) {
      console.log("Kakao SDK is available, loading map...");
      window.kakao.maps.load(loadKakaoMap);
    } else {
      console.log("Waiting for Kakao SDK to load...");
      const checkKakao = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          console.log("Kakao SDK loaded, initializing map...");
          clearInterval(checkKakao);
          window.kakao.maps.load(loadKakaoMap);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkKakao);
        console.error("Kakao SDK loading timeout");
      }, 10000);

      return () => clearInterval(checkKakao);
    }
  }, [places, selectedPlaceIds, onPlaceClick, showRoute]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-lg"
      style={{ minHeight: "600px" }}
    />
  );
};

export default MultiPlaceMap;
