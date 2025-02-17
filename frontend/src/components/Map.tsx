import { useState, useMemo } from 'react';
import { GoogleMap, InfoWindow, MarkerF } from '@react-google-maps/api';
import { SocialProgram } from '../types';
import styles from './Map.module.scss';

interface MapProps {
  programs: SocialProgram[];
  userLocation: { lat: number; lng: number } | null;
  selectedProgramId: number | null;
  onProgramSelect: (id: number | null) => void;
}

export default function Map({ 
  programs, 
  userLocation, 
  selectedProgramId, 
  onProgramSelect 
}: MapProps) {
  const [showUserInfo, setShowUserInfo] = useState(false);

  const center = useMemo(() => 
    userLocation || (programs[0]?.latitude 
      ? { lat: programs[0].latitude, lng: programs[0].longitude }
      : { lat: 40.7128, lng: -74.0060 }
    ), [userLocation, programs]
  );

  const selectedProgram = useMemo(() => 
    programs.find(p => p.id === selectedProgramId),
    [programs, selectedProgramId]
  );

  const handleMapClick = () => {
    onProgramSelect(null);
    setShowUserInfo(false);
  };

  const handleMarkerClick = (programId: number) => {
    onProgramSelect(programId);
    setShowUserInfo(false);
  };

  return (
    <GoogleMap
      mapContainerClassName={styles.mapContainer}
      center={center}
      zoom={12}
      onClick={handleMapClick}
    >
      {userLocation && (
        <>
          <MarkerF
            position={userLocation}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new google.maps.Size(50, 50),
            }}
            onClick={() => {
              onProgramSelect(null);
              setShowUserInfo(true);
            }}
          />
          {showUserInfo && (
            <InfoWindow
              position={userLocation}
              onCloseClick={() => setShowUserInfo(false)}
            >
              <div className={styles.infoWindow}>
                <p className={styles.infoWindowUserLocation}>Your Location</p>
              </div>
            </InfoWindow>
          )}
        </>
      )}

      {programs.map((program) => (
        <MarkerF
          key={program.id}
          position={{ lat: program.latitude, lng: program.longitude }}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new google.maps.Size(40, 40),
          }}
          onClick={() => handleMarkerClick(program.id)}
        >
          {selectedProgram?.id === program.id && (
            <InfoWindow onCloseClick={() => onProgramSelect(null)}>
              <div className={styles.infoWindow}>
                <h3 className={styles.infoWindowTitle}>{program.name}</h3>
                <p className={styles.infoWindowType}>
                  {program.types?.length > 0 
                    ? program.types.join(', ')
                    : 'No types specified'}
                </p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(program.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoWindowAddress}
                  onClick={(e) => e.stopPropagation()}
                >
                  {program.address}
                </a>
              </div>
            </InfoWindow>
          )}
        </MarkerF>
      ))}
    </GoogleMap>
  );
}