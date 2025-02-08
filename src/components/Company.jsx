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

  React.useEffect(() => {
    // 正確な住所
    const address = companyInfo.details.find(detail => detail.icon === 'location')?.value;

    // Google Maps APIの初期化
    window.initMap = () => {
      if (!mapRef.current) return;

      // Geocoderの初期化
      const geocoder = new google.maps.Geocoder();

      // 住所から座標を取得
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          
          const newMap = new google.maps.Map(mapRef.current, {
            center: location,
            zoom: 17,
            styles: [
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
            scale: 0.6, // スケールを0.4から0.6に大きく
            anchor: new google.maps.Point(32, 100)
          };

          // ラベル（ロゴ）のスタイルを設定
          const markerLabel = {
            url: '/orcx-logo.png',
            scaledSize: new google.maps.Size(55, 55), // サイズを40から55に大きく
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(27.5, 65) // アンカーポイントを新しいサイズに合わせて調整（55/2 = 27.5）
          };

          // マーカーを追加（白いピン）
          const baseMarker = new google.maps.Marker({
            position: location,
            map: newMap,
            icon: markerIcon,
            animation: google.maps.Animation.DROP,
            zIndex: 1
          });

          // ロゴを重ねて表示
          const logoMarker = new google.maps.Marker({
            position: location,
            map: newMap,
            icon: markerLabel,
            title: "ORCX株式会社 用賀オフィス",
            animation: google.maps.Animation.DROP,
            zIndex: 2 // ベースマーカーの上に表示
          });

          setMap(newMap);
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    };

    // Google Maps APIのスクリプトを読み込む
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=geocoding`;
    script.async = true;
    script.defer = true;
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
    <motion.div
      variants={fadeIn("right", "spring", index * 0.1, 0.75)}
      className={`w-full bg-tertiary/20 backdrop-blur-sm p-3 rounded-lg border border-white/5
        ${isClickable ? 'hover:bg-tertiary/30 cursor-pointer' : ''}`}
    >
      {isClickable ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      ) : (
        content
      )}
    </motion.div>
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
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          {companyInfo.title}
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          {companyInfo.subtitle}
        </h2>
      </motion.div>

      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        <motion.div 
          variants={fadeIn("right", "spring", 0.2, 0.75)}
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

        <motion.div 
          variants={fadeIn("left", "spring", 0.3, 0.75)}
          className="flex-1"
        >
          <GoogleMap />
        </motion.div>
      </div>
    </>
  );
};

export default SectionWrapper(Company, "company");
