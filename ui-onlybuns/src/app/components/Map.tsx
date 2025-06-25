// components/MapComponent.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Post } from '../types/Post';
import PublicPostFeed from './PublicPostFeed';

// This is a fix for a common issue with Leaflet icons in React.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapProps {
  posts: Post[];
}

// A helper component to programmatically change the map's view.
const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const MapComponent: React.FC<MapProps> = ({ posts }) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We use the browser's geolocation API to get the user's current location.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
        setLoading(false);
      },
      () => {
        console.error("Permission to access location was denied.");
        // Fallback to a default location (e.g., center of your country)
        setUserPosition([44.20, 20.92]); 
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return <div>Getting your location...</div>;
  }
  
  if (!userPosition) {
    return <div>Could not retrieve your location.</div>
  }

  return (
    <MapContainer center={userPosition} zoom={7} style={{ height: '100%', width: '100%' }}>
      <ChangeView center={userPosition} zoom={7} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Marker for the user's current location */}
      <Marker position={userPosition}>
        <Popup>You are here!</Popup>
      </Marker>

      {/* We map through the posts and create a marker for each one */}
      {posts.map((post) => (
        post.location && (
          <Marker key={post.id} position={[post.location.latitude, post.location.longitude]}>
            <Popup>
              <PublicPostFeed post={post} />
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default MapComponent;
