import React from "react";
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

const GoogleMap = () => {
  const mapRef = React.useRef(null);
  const [map, setMap] = React.useState(null);
  const infoWindowRef = React.useRef(null);
  const markersRef = React.useRef({ base: null, logo: null });

  React.useEffect(() => {
    const address = companyInfo.details.find(detail => detail.icon === 'location')?.value;

    // Google Maps APIのスクリプトを読み込む前にmapRef.currentが存在することを確認
    if (!mapRef.current) return;

    window.initMap = () => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          
          const newMap = new google.maps.Map(mapRef.current, {
            center: location,
            zoom: 17,
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
            gestureHandling: 'cooperative',
            disableDefaultUI: true,
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

          // マーカーのスタイルをカスタマイズ
          const markerIcon = {
            path: 'M32 0C14.3 0 0 14.3 0 32c0 36.8 32 76.8 32 76.8S64 68.8 64 32C64 14.3 49.7 0 32 0z',
            fillColor: '#FFFFFF',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: 0.6,
            anchor: new google.maps.Point(32, 85)
          };

          // ラベル（ロゴ）のスタイルを設定
          const markerLabel = {
            url: '/orcx-logo.png',
            scaledSize: new google.maps.Size(55, 55),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(27.5, 55)
          };

          // マーカーを作成
          markersRef.current.base = new google.maps.Marker({
            position: location,
            map: newMap,
            icon: markerIcon,
            animation: google.maps.Animation.DROP,
            zIndex: 1
          });

          markersRef.current.logo = new google.maps.Marker({
            position: location,
            map: newMap,
            icon: markerLabel,
            title: "ORCX株式会社 用賀オフィス",
            animation: google.maps.Animation.DROP,
            zIndex: 2
          });

          // InfoWindowを作成
          infoWindowRef.current = new google.maps.InfoWindow({
            content: `
              <div style="
                position: relative;
                min-width: 320px;
                background: rgba(26, 29, 41, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.1);
                overflow: visible;
              ">
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  padding: 16px;
                  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                  background: linear-gradient(to right, rgba(255, 255, 255, 0.05), transparent);
                ">
                  <div style="
                    width: 24px;
                    height: 24px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <img src="/orcx-logo.png" 
                      style="
                        width: 20px;
                        height: 20px;
                        object-fit: contain;
                      "
                    />
                  </div>
                  <h3 style="margin: 0; font-size: 16px; font-weight: 500; color: #ffffff; letter-spacing: 0.5px; flex-grow: 1;">
                    ORCX株式会社
                  </h3>
                </div>
                <div style="padding: 16px;">
                  <div style="font-size: 14px; line-height: 1.6; color: rgba(255, 255, 255, 0.8);">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                      <svg style="width: 16px; height: 16px; opacity: 0.6;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span style="font-size: 13px;">〒158-0097</span>
                    </div>
                    <p style="margin: 0 0 16px 24px; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                      東京都世田谷区用賀4-18-7
                    </p>
                    <div style="display: flex; align-items: center; gap: 8px; margin-left: 24px;">
                      <svg style="width: 16px; height: 16px; opacity: 0.6;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <a href="https://maps.google.com/?q=東京都世田谷区用賀4-18-7" 
                        target="_blank"
                        style="color: #00ADB5; text-decoration: none; font-size: 14px; transition: color 0.2s;"
                        onmouseover="this.style.color='#00c4cc'"
                        onmouseout="this.style.color='#00ADB5'"
                      >
                        Google Mapで見る
                      </a>
                    </div>
                  </div>
                </div>
                <div style="
                  position: absolute;
                  bottom: -10px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 0;
                  height: 0;
                  border-left: 10px solid transparent;
                  border-right: 10px solid transparent;
                  border-top: 10px solid rgba(26, 29, 41, 0.95);
                  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.1));
                "></div>
              </div>
            `,
            pixelOffset: new google.maps.Size(0, -25),
            disableAutoPan: false,
            maxWidth: 360
          });

          // マーカーのクリックイベントを設定
          const handleMarkerClick = () => {
            infoWindowRef.current.open({
              anchor: markersRef.current.logo,
              map: newMap
            });

            // スタイルのカスタマイズ
            setTimeout(() => {
              const iwOuter = document.querySelector('.gm-style-iw-c');
              const iwBackground = document.querySelector('.gm-style-iw-tc');
              const iwCloseBtn = document.querySelector('.gm-style-iw-d');
              
              if (iwBackground) {
                iwBackground.style.display = 'none';
              }
              
              if (iwOuter) {
                iwOuter.style.padding = '0';
                iwOuter.style.background = 'none';
                iwOuter.style.boxShadow = 'none';
                iwOuter.style.overflow = 'visible'; // スクロールを無効化
              }
              
              if (iwCloseBtn) {
                iwCloseBtn.style.overflow = 'visible'; // スクロールを無効化
                const closeButton = iwCloseBtn.parentElement.querySelector('button');
                if (closeButton) {
                  closeButton.style.top = '8px';
                  closeButton.style.right = '8px';
                  closeButton.style.opacity = '1';
                }
              }
            }, 10);
          };

          // 両方のマーカーにクリックイベントを追加
          [markersRef.current.base, markersRef.current.logo].forEach(marker => {
            marker.addListener('click', handleMarkerClick);
          });

          setMap(newMap);
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    };

    // Google Maps APIのスクリプトを読み込む
    console.log('Google Maps API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=geocoding`;
    script.async = true;
    script.defer = true;
    script.onerror = (error) => {
      console.error('Google Maps API script failed to load:', error);
    };
    document.head.appendChild(script);

    return () => {
      if (map) {
        setMap(null);
      }
      delete window.initMap;
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
      style={{ 
        position: 'relative', 
        height: '400px',
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

      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        <motion.div 
          initial={{ x: -100 }}
          whileInView={{ x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex-1"
        >
          <div className="flex flex-col space-y-2">
            {companyInfo.details.map((detail, index) => (
              <CompanyDetail
                key={detail.label}
                index={index}
                {...detail}
              />
            ))}
          </div>
        </motion.div>

        <div className="flex-1">
          <GoogleMap />
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Company, "company");
