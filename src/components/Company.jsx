import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BiBuildingHouse,
  BiCalendar,
  BiMap,
  BiUser,
  BiMoney,
  BiGroup,
  BiEnvelope,
  BiGlobe,
  BiCodeAlt
} from "react-icons/bi";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { companyInfo } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { logo } from "../assets";
import { useMediaQuery } from "../hooks";

// Google Maps APIのロード状態を追跡する変数
let isGoogleMapsLoading = false;
let isGoogleMapsLoaded = false;

const GoogleMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = React.useState(null);
  const infoWindowRef = useRef(null);
  const markersRef = useRef({ base: null, logo: null });
  const scriptRef = useRef(null);
  // モバイルデバイスかどうかを検出
  const isMobile = useMediaQuery("(max-width: 767px)");
  // 地図の読み込みエラーの状態
  const [mapLoadError, setMapLoadError] = React.useState(false);

  useEffect(() => {
    // 本番環境でエラーが発生している場合は、直接フォールバックを表示
    if (window.location.hostname === 'www.orcx.co.jp') {
      setMapLoadError(true);
      return;
    }

    // DOMの準備ができていることを確認
    if (!mapRef.current) {
      console.warn('Map container is not ready');
      return;
    }

    const address = companyInfo.details.find(detail => detail.icon === 'location')?.value;
    if (!address) {
      console.warn('Address not found');
      return;
    }

    // エラーハンドリング用の関数
    const handleLoadError = (error) => {
      console.error('Google Maps API loading failed:', error);
      isGoogleMapsLoading = false;
      setMapLoadError(true);
    };

    // 初期化関数を定義
    const initializeMapWithAPI = () => {
        if (!mapRef.current) return;

        try {
        // window.googleが既に存在するか確認
        if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
          console.warn('Google Maps API not fully loaded');
          return;
        }

        isGoogleMapsLoaded = true;
        isGoogleMapsLoading = false;

        const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results[0]) {
              initializeMap(results[0].geometry.location);
            } else {
              console.error('Geocode was not successful:', status);
            }
          });
        } catch (error) {
          console.error('Map initialization failed:', error);
        }
    };

    // Google Maps APIをロード
    const loadGoogleMapsAPI = () => {
      // エラー状態の場合は何もしない
      if (mapLoadError) return;

      // 既にグローバルなスクリプトロード中の場合は待機
      if (isGoogleMapsLoading) {
        // 定期的にAPIのロードが完了したかチェック
        const checkInterval = setInterval(() => {
          if (isGoogleMapsLoaded && window.google && window.google.maps) {
            clearInterval(checkInterval);
            initializeMapWithAPI();
          }
        }, 100);
        
        // 10秒後にタイムアウト
        setTimeout(() => {
          clearInterval(checkInterval);
          console.error('Google Maps API loading timeout');
          setMapLoadError(true);
        }, 10000);
        return;
      }
      
      // 既にグローバルにAPIがロード済みの場合
      if (isGoogleMapsLoaded && window.google && window.google.maps) {
        initializeMapWithAPI();
        return;
      }

      // どのコンポーネントからもまだロードされていない場合
      isGoogleMapsLoading = true;
      
      // APIをロード
      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      // APIキーが存在しない場合のフォールバック処理
      if (!apiKey) {
        console.error('Google Maps API key is not defined');
        return;
      }

      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&loading=async`;
      script.async = true;
      script.defer = true;

      // グローバルコールバック関数を定義
      window.initMap = () => {
        isGoogleMapsLoaded = true;
        isGoogleMapsLoading = false;
        initializeMapWithAPI();
      };

      script.onerror = (error) => {
        console.error('Google Maps API loading failed:', error);
        isGoogleMapsLoading = false;
        setMapLoadError(true);
      };

      document.head.appendChild(script);
      scriptRef.current = script;
    };

    // APIをロード
    loadGoogleMapsAPI();

    // 地図の初期化関数
    const initializeMap = (location) => {
      if (!window.google || !window.google.maps) return;
      
      try {
        const newMap = new window.google.maps.Map(mapRef.current, {
        center: location,
          zoom: isMobile ? 16 : 17, // モバイルではズームレベルを調整
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          },
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#1a1d29"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1a1d29"
              },
              {
                "visibility": "simplified"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#2c303d"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#242836"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#6f7285"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#2d3241"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#8c93a8"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#3d4254"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#a8aec4"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#151821"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#4e6d70"
              }
            ]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
          gestureHandling: isMobile ? 'cooperative' : 'greedy',
          disableDefaultUI: isMobile,
        backgroundColor: '#1a1d29',
        restriction: {
          latLngBounds: {
            north: location.lat() + 0.01,
            south: location.lat() - 0.01,
            east: location.lng() + 0.01,
            west: location.lng() - 0.01,
          },
          strictBounds: true
        }
      });

        setMap(newMap);

        // マーカーを設定
        if (markersRef.current.base) {
          markersRef.current.base.setMap(null);
        }

        // カスタムマーカーアイコンの設定
        const markerIcon = {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: '#ffffff',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 2,
          anchor: new window.google.maps.Point(12, 22),
        };

        markersRef.current.base = new window.google.maps.Marker({
          position: location,
          map: newMap,
          icon: markerIcon,
          animation: window.google.maps.Animation.DROP,
          title: companyInfo.details.find(detail => detail.icon === 'location')?.value
        });

        // カスタムInfoWindowのスタイル
        const infoWindowContent = `
          <div style="
            padding: 16px 20px;
            background: rgba(26, 29, 41, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            backdrop-filter: blur(12px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            position: relative;
            min-width: 280px;
          ">
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 1px;
              background: linear-gradient(90deg, 
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.1) 50%,
                rgba(255, 255, 255, 0) 100%
              );
            "></div>
            <div style="
              color: rgba(255, 255, 255, 0.9);
              font-size: 15px;
              line-height: 1.6;
              font-family: 'Noto Sans JP', sans-serif;
              letter-spacing: 0.02em;
            ">${companyInfo.details.find(detail => detail.icon === 'location')?.value || ''}</div>
          </div>
        `;

        // infoWindowを作成
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        
        infoWindowRef.current = new window.google.maps.InfoWindow({
          content: infoWindowContent,
          pixelOffset: new window.google.maps.Size(0, -15),
          maxWidth: 320,
          arrowStyle: 2
        });

        // マーカーホバー時のアニメーション
        markersRef.current.base.addListener('mouseover', () => {
          if (markersRef.current.base.getAnimation() !== null) return;
          markersRef.current.base.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => {
            markersRef.current.base.setAnimation(null);
          }, 750);
        });

        // マーカークリックでInfoWindowを表示
        markersRef.current.base.addListener('click', () => {
          infoWindowRef.current.open(newMap, markersRef.current.base);
        });

      } catch (error) {
        console.error('Map initialization error:', error);
      }
    };

    return () => {
      // マーカーとinfoWindowのクリーンアップ
      if (markersRef.current.base) {
        markersRef.current.base.setMap(null);
      }
      if (markersRef.current.logo) {
        markersRef.current.logo.setMap(null);
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      
      // マップの参照をクリア
      if (map) {
        setMap(null);
      }
    };
  }, [isMobile, mapLoadError]);

  // 地図読み込みエラー時のフォールバックUI
  if (mapLoadError) {
    return (
      <div 
        className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl flex items-center justify-center"
        style={{ 
          position: 'relative', 
          height: isMobile ? '350px' : '400px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: '#1a1d29'
        }}
      >
        <div className="text-center p-6">
          <BiMap size={48} className="text-white/50 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">地図を表示できません</h3>
          <p className="text-white/70 mb-4">
            {companyInfo.details.find(detail => detail.icon === 'location')?.value}
          </p>
          <a 
            href="https://goo.gl/maps/NnMpGrAVVR7hvwEp7" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary/80 hover:bg-primary text-white py-2 px-4 rounded-lg transition-all duration-300"
          >
            Google マップで見る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
      style={{ 
        position: 'relative', 
        height: isMobile ? '350px' : '400px', // モバイルでは高さを調整
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#1a1d29'
      }}
    />
  );
};

const CompanyDetail = ({ label, value, icon, index }) => {
  const isClickable = icon === 'email' || icon === 'website';
  const href = icon === 'email' ? `mailto:${value}` : icon === 'website' ? value : null;

  const content = (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm">
        {getIcon(icon)}
      </div>
      <div className="flex-1">
        <h3 className="text-[13px] text-secondary tracking-wider">
          {label}
        </h3>
        <p className="text-white text-[15px] font-medium">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#1d1836] backdrop-blur-sm p-3 rounded-lg border border-white/5 transition-all duration-300">
      {isClickable ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};

const getIcon = (iconName) => {
  const iconMap = {
    building: BiBuildingHouse,
    calendar: BiCalendar,
    location: BiMap,
    user: BiUser,
    money: BiMoney,
    users: BiGroup,
    email: BiEnvelope,
    website: BiGlobe,
    service: BiCodeAlt
  };
  const IconComponent = iconMap[iconName] || BiBuildingHouse;
  return <IconComponent size={24} className="text-white" />;
};

const Company = () => {
  // モバイルデバイスかどうかを検出
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <>
      <div>
        <p className={`${styles.sectionSubText} text-center`}>
          {companyInfo.title}
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          {companyInfo.subtitle}
        </h2>
      </div>

      <div className={`mt-8 flex ${isMobile ? 'flex-col' : 'flex-col lg:flex-row'} gap-6`}>
        <div className={`${isMobile ? 'order-1' : 'order-1'} flex-1`}>
          <div className="flex flex-col space-y-2">
            {companyInfo.details.map((detail, index) => (
              <CompanyDetail
                key={detail.label}
                index={index}
                {...detail}
              />
            ))}
          </div>
        </div>

        <div className={`${isMobile ? 'order-2 mt-6' : 'order-2'} flex-1`}>
          <GoogleMap />
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Company, "company");
