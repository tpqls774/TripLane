import React, { useEffect, useRef } from "react";

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  latitude,
  longitude,
  title,
  address,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    console.log("KakaoMap Component - Coordinates:", {
      latitude,
      longitude,
      title,
      address,
    });

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
        console.log("Initializing Kakao Map...");

        // 지도 옵션
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3, // 확대 레벨
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(mapContainer.current, options);
        mapRef.current = map;
        console.log("Map created successfully");

        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
        console.log("Marker created successfully");

        // 인포윈도우 생성
        const infowindowContent = `
          <div style="padding: 10px; min-width: 150px; text-align: center;">
            <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
            ${
              address
                ? `<div style="font-size: 12px; color: #666;">${address}</div>`
                : ""
            }
          </div>
        `;

        const infowindow = new window.kakao.maps.InfoWindow({
          content: infowindowContent,
        });

        // 마커에 마우스오버 이벤트 등록
        window.kakao.maps.event.addListener(marker, "mouseover", () => {
          infowindow.open(map, marker);
        });

        // 마커에 마우스아웃 이벤트 등록
        window.kakao.maps.event.addListener(marker, "mouseout", () => {
          infowindow.close();
        });

        // 초기에 인포윈도우 열기
        infowindow.open(map, marker);
        console.log("InfoWindow created and opened successfully");
      } catch (error) {
        console.error("Error initializing Kakao Map:", error);
      }
    };

    // Kakao Maps SDK가 로드되었는지 확인
    if (window.kakao && window.kakao.maps) {
      console.log("Kakao SDK is available, loading map...");
      window.kakao.maps.load(loadKakaoMap);
    } else {
      console.log("Waiting for Kakao SDK to load...");
      // SDK 로드 대기
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
