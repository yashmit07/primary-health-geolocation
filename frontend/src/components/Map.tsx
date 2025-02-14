import { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { SocialProgram } from '../types';

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

  // Find the selected program
  const selectedProgram = programs.find(p => p.id === selectedProgramId);

  return (
    <GoogleMap
      mapContainerClassName="w-full h-96 rounded-lg"
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
              <div className="p-1">
                <p className="font-semibold">Your Location</p>
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
                <h3 className="font-semibold text-black">{program.name}</h3>
                <p className="text-sm text-gray-600">{program.programType}</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(program.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
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