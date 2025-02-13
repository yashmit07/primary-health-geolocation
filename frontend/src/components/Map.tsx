'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { SocialProgram } from '../types';

interface MapProps {
  programs: SocialProgram[];
}

const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York City

export default function Map({ programs }: MapProps) {
  const center = programs.length > 0 
    ? { lat: programs[0].latitude, lng: programs[0].longitude }
    : defaultCenter;

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerClassName="w-full h-[600px] rounded-lg"
        center={center}
        zoom={12}
      >
        {programs.map((program) => (
          <Marker
            key={program.id}
            position={{ lat: program.latitude, lng: program.longitude }}
            title={program.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}