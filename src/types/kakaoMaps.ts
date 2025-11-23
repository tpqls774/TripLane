// Kakao Maps SDK 타입 정의
export interface KakaoMapsLatLng {
  getLat(): number;
  getLng(): number;
}

export interface KakaoMapsMap {
  setCenter(latlng: KakaoMapsLatLng): void;
  setLevel(level: number): void;
  setBounds(bounds: KakaoMapsLatLngBounds): void;
  getLevel(): number;
  getCenter(): KakaoMapsLatLng;
}

export interface KakaoMapsMarker {
  setMap(map: KakaoMapsMap | null): void;
  getPosition(): KakaoMapsLatLng;
}

export interface KakaoMapsInfoWindow {
  open(map: KakaoMapsMap, marker: KakaoMapsMarker): void;
  close(): void;
}

export interface KakaoMapsPolyline {
  setMap(map: KakaoMapsMap | null): void;
}

export interface KakaoMapsLatLngBounds {
  extend(latlng: KakaoMapsLatLng): void;
  isEmpty(): boolean;
  getNorthEast(): KakaoMapsLatLng;
  getSouthWest(): KakaoMapsLatLng;
}

export interface KakaoMapsEvent {
  addListener(
    target: KakaoMapsMarker,
    eventType: string,
    handler: () => void
  ): void;
}

export interface KakaoMapsNamespace {
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
  Polyline: new (options: {
    path: KakaoMapsLatLng[];
    strokeWeight: number;
    strokeColor: string;
    strokeOpacity: number;
    strokeStyle: string;
  }) => KakaoMapsPolyline;
  LatLngBounds: new () => KakaoMapsLatLngBounds;
  event: KakaoMapsEvent;
  load(callback: () => void): void;
}

export interface KakaoSDK {
  maps: KakaoMapsNamespace;
}

// 전역 타입 선언 (한 번만 선언)
declare global {
  interface Window {
    kakao: KakaoSDK;
  }
}

