import { useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { SocialProgram } from '../types';
import styles from './Map.module.scss';

interface MapProps {
  programs: SocialProgram[];
  userLocation: { lat: number; lng: number } | null;
  selectedProgramId: number | null;
  onProgramSelect: (id: number | null) => void;
}

export default function Map({ programs, userLocation, selectedProgramId, onProgramSelect }: MapProps) {
  const [showUserInfo, setShowUserInfo] = useState(false);

  const center = userLocation || (programs[0]?.latitude 
    ? { lat: programs[0].latitude, lng: programs[0].longitude }
    : { lat: 40.7128, lng: -74.0060 }
  );

  const selectedProgram = programs.find(p => p.id === selectedProgramId);

  return (
    <GoogleMap
      mapContainerClassName={styles.mapContainer}
      center={center}
      zoom={12}
      onClick={() => {
        onProgramSelect(null);
        setShowUserInfo(false);
      }}
    >
      {/* User Location */}
      {userLocation && (
        <>
          <Marker
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
              <div className={styles.infoWindowContent}>
                <p className={styles.userLocation}>Your Location</p>
              </div>
            </InfoWindow>
          )}
        </>
      )}

      {/* Program Markers */}
      {programs.map((program) => (
        <Marker
          key={program.id}
          position={{ lat: program.latitude, lng: program.longitude }}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new google.maps.Size(40, 40),
          }}
          onClick={() => {
            onProgramSelect(program.id);
            setShowUserInfo(false);
          }}
        >
          {selectedProgram?.id === program.id && (
            <InfoWindow onCloseClick={() => onProgramSelect(null)}>
              <div>
                <h3 className={styles.programName}>{program.name}</h3>
                <p className={styles.programType}>{program.programType}</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(program.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.programAddress}
                >
                  {program.address}
                </a>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
}