import React, { useEffect, useRef } from "react";
import type {
  KakaoMapsMap,
  KakaoMapsMarker,
  KakaoMapsPolyline,
} from "../../types/kakaoMaps";
import "../../types/kakaoMaps"; // 전역 타입 선언을 위해 import

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

// 하버사인 공식을 사용한 거리 계산 (km)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Nearest Neighbor 알고리즘으로 최적 경로 계산
const optimizeRoute = (places: Place[]): Place[] => {
  if (places.length <= 1) return places;

  // 첫 번째 장소를 시작점으로 설정
  const optimized: Place[] = [places[0]];
  const unvisited = places.slice(1);
  let current = places[0];

  // 모든 장소를 방문할 때까지 반복
  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(
      current.lat,
      current.lng,
      unvisited[0].lat,
      unvisited[0].lng
    );

    // 가장 가까운 장소 찾기
    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(
        current.lat,
        current.lng,
        unvisited[i].lat,
        unvisited[i].lng
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    // 가장 가까운 장소를 경로에 추가
    const nearest = unvisited[nearestIndex];
    optimized.push(nearest);
    current = nearest;
    unvisited.splice(nearestIndex, 1);
  }

  return optimized;
};

const MultiPlaceMap: React.FC<MultiPlaceMapProps> = ({
  places,
  selectedPlaceIds = [],
  onPlaceClick,
  showRoute = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMapsMap | null>(null);
  const markersRef = useRef<KakaoMapsMarker[]>([]);
  const polylineRef = useRef<KakaoMapsPolyline | null>(null);
  const isInitializedRef = useRef(false);
  const placesRef = useRef<string>("");

  // 지도 초기화 (한 번만)
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

      if (isInitializedRef.current) {
        return; // 이미 초기화되었으면 다시 초기화하지 않음
      }

      // places가 없으면 초기화 대기
      if (places.length === 0) {
        return;
      }

      try {
        // 지도 중심 계산 (모든 장소의 평균 위치)
        let centerLat = 0;
        let centerLng = 0;

        places.forEach((place) => {
          centerLat += place.lat;
          centerLng += place.lng;
        });
        centerLat /= places.length;
        centerLng /= places.length;

        const options = {
          center: new window.kakao.maps.LatLng(centerLat, centerLng),
          level: 8,
        };

        const map = new window.kakao.maps.Map(mapContainer.current, options);
        mapRef.current = map;
        isInitializedRef.current = true;

        // 초기 마커 및 bounds 설정
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

        // 초기화 시에만 bounds 설정
        const bounds = new window.kakao.maps.LatLngBounds();
        places.forEach((place) => {
          bounds.extend(new window.kakao.maps.LatLng(place.lat, place.lng));
        });
        map.setBounds(bounds);

        // places를 문자열로 변환하여 저장 (내용 비교용)
        placesRef.current = JSON.stringify(places.map(p => ({ placeId: p.placeId, lat: p.lat, lng: p.lng })));

        // 초기화 완료 후 경로 그리기 (showRoute가 true인 경우)
        if (showRoute && places.length > 1) {
          const optimizedPlaces = optimizeRoute(places);
          const linePath = optimizedPlaces.map(
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
        }

      } catch (error) {
        console.error("Error initializing Multi-Place Kakao Map:", error);
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

      return () => clearInterval(checkKakao);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places.length]); // places.length를 의존성에 추가하여 places가 로드되면 초기화

  // places가 실제로 변경되었을 때만 마커 업데이트 (bounds는 변경하지 않음)
  useEffect(() => {
    if (!mapRef.current || !isInitializedRef.current) return;

    const currentPlacesStr = JSON.stringify(places.map(p => ({ placeId: p.placeId, lat: p.lat, lng: p.lng })));
    
    // places 내용이 실제로 변경되었는지 확인
    if (currentPlacesStr === placesRef.current) {
      return; // 내용이 같으면 업데이트하지 않음
    }

    placesRef.current = currentPlacesStr;
    const map = mapRef.current;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 추가
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

    // 주의: bounds는 업데이트하지 않음 (배율 유지)
  }, [places, selectedPlaceIds, onPlaceClick]);

  // 경로 표시/숨김 (showRoute 변경 시)
  useEffect(() => {
    if (!mapRef.current || !isInitializedRef.current) return;
    if (places.length === 0) return;

    const map = mapRef.current;

    // 기존 경로 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (showRoute && places.length > 1) {
      // Nearest Neighbor 알고리즘으로 최적 경로 계산
      const optimizedPlaces = optimizeRoute(places);

      const linePath = optimizedPlaces.map(
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
    }
  }, [showRoute, places]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-lg"
      style={{ minHeight: "600px" }}
    />
  );
};

export default MultiPlaceMap;
