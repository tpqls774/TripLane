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

        // 지도 옵션
        const options = {
          center: new window.kakao.maps.LatLng(centerLat, centerLng),
          level: 8, // 여러 장소를 보기 위해 더 넓은 범위
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(mapContainer.current, options);
        mapRef.current = map;
        console.log("Map created successfully");

        // 기존 마커 제거
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        // 각 장소에 마커 추가
        places.forEach((place, index) => {
          const markerPosition = new window.kakao.maps.LatLng(
            place.lat,
            place.lng
          );

          // 선택된 장소는 다른 색상의 마커 사용
          const isSelected = selectedPlaceIds.includes(place.placeId);

          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            title: place.title,
          });

          marker.setMap(map);
          markersRef.current.push(marker);

          // 인포윈도우 생성
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

          // 마커 클릭 이벤트
          window.kakao.maps.event.addListener(marker, "click", () => {
            if (onPlaceClick) {
              onPlaceClick(place.placeId);
            }
          });

          // 마커에 마우스오버 이벤트
          window.kakao.maps.event.addListener(marker, "mouseover", () => {
            infowindow.open(map, marker);
          });

          // 마커에 마우스아웃 이벤트
          window.kakao.maps.event.addListener(marker, "mouseout", () => {
            infowindow.close();
          });
        });

        // 경로선 그리기
        if (showRoute && places.length > 1) {
          // 기존 경로선 제거
          if (polylineRef.current) {
            polylineRef.current.setMap(null);
          }

          // 경로 좌표 배열 생성
          const linePath = places.map(
            (place) => new window.kakao.maps.LatLng(place.lat, place.lng)
          );

          // 경로선 생성
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
          // 경로 표시 비활성화시 경로선 제거
          polylineRef.current.setMap(null);
          polylineRef.current = null;
        }

        // 모든 마커가 보이도록 지도 범위 재설정
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

    // Kakao Maps SDK가 로드되었는지 확인
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

      // 10초 후 타임아웃
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
