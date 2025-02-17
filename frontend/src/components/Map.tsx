import { useState, useMemo } from 'react';
import { GoogleMap, InfoWindow, MarkerF, useLoadScript } from '@react-google-maps/api';
import type { SocialProgram } from '@/types';

interface MapProps {
  programs: SocialProgram[];
  userLocation: { lat: number; lng: number } | null;
  selectedProgramId: number | null;
  onProgramSelect: (id: number | null) => void;
}

function InfoWindowContent({ program }: { program: SocialProgram }) {
  return (
    <div className="p-3 max-w-sm">
      <h3 className="font-medium text-lg mb-1 text-black">{program.name}</h3>
      <p className="text-sm text-gray-600 mb-2">
        {program.types?.length > 0 
          ? program.types.join(', ')
          : 'No types specified'}
      </p>
      <a 
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(program.address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {program.address}
      </a>
    </div>
  );
}

const MAP_CONFIG = {
  defaultCenter: { lat: 40.7128, lng: -74.0060 }, // NYC
  defaultZoom: 12,
  markers: {
    user: {
      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    },
    program: {
      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    },
  },
} as const;

export default function Map({ 
  programs, 
  userLocation, 
  selectedProgramId, 
  onProgramSelect 
}: MapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places']
  });

  const [showUserInfo, setShowUserInfo] = useState(false);

  const center = useMemo(() => 
    userLocation || (programs[0]?.latitude 
      ? { lat: programs[0].latitude, lng: programs[0].longitude }
      : MAP_CONFIG.defaultCenter
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

  if (!isLoaded) {
    return <div className="w-full h-full flex items-center justify-center">Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full rounded-lg overflow-hidden"
      center={center}
      zoom={MAP_CONFIG.defaultZoom}
      onClick={handleMapClick}
    >
      {userLocation && (
        <>
          <MarkerF
            position={userLocation}
            icon={MAP_CONFIG.markers.user}
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
              <div className="p-3">
                <p className="font-medium text-blue-600">Your Location</p>
              </div>
            </InfoWindow>
          )}
        </>
      )}

      {programs.map((program) => (
        <MarkerF
          key={program.id}
          position={{ lat: program.latitude, lng: program.longitude }}
          icon={MAP_CONFIG.markers.program}
          onClick={() => {
            onProgramSelect(program.id);
            setShowUserInfo(false);
          }}
        >
          {selectedProgram?.id === program.id && (
            <InfoWindow onCloseClick={() => onProgramSelect(null)}>
              <InfoWindowContent program={program} />
            </InfoWindow>
          )}
        </MarkerF>
      ))}
    </GoogleMap>
  );
}