"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Post } from '../types/Post';
import { UserProfile } from '../types/UserProfile';
import { BunnyCare } from '../types/BunnyCare';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const bunnyCareIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  posts: Post[];
  bunnyCareLocations: BunnyCare[];
  currentUser: UserProfile;
}

const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

function groupPostsByLocation(posts: Post[]) {
    const groups: { [key: string]: Post[] } = {};
    posts.forEach(post => {
        if (post.location && post.location.latitude && post.location.longitude) {
            const key = `${post.location.latitude},${post.location.longitude}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(post);
        }
    });
    return groups;
}

const MapComponent: React.FC<MapProps> = ({ posts, bunnyCareLocations, currentUser }) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const groupedPosts = groupPostsByLocation(posts);

  useEffect(() => {
    if (
      currentUser &&
      typeof currentUser.latitude === "number" &&
      typeof currentUser.longitude === "number"
    ) {
      setUserPosition([currentUser.latitude, currentUser.longitude]);
    } else {
      setUserPosition([44.20, 20.92]); // fallback location
    }
    setLoading(false);
  }, [currentUser]);

  if (loading) {
    return <div>Getting your location...</div>;
  }
  
  if (!userPosition) {
    return <div>Could not retrieve your location.</div>
  }

  return (
    <MapContainer center={userPosition} zoom={7} style={{ height: '85%', width: '100%' }}>
      <ChangeView center={userPosition} zoom={13} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker position={userPosition} icon={userIcon}>
        <Popup>
          <div style={{ minWidth: '200px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#2d3748' }}>
              Your Location
              <br />
              🏠 {currentUser.address ? currentUser.address : "No address"}
              <div style={{ fontWeight: 'normal', fontSize: '0.95em', color: '#4a5568', marginTop: '2px' }}>
                ({userPosition[0].toFixed(5)}, {userPosition[1].toFixed(5)})
              </div>
            </div>
          </div>
        </Popup>
      </Marker>

      {/* Bunny Care Location markers */}
      {bunnyCareLocations.map((bunnyCare) => (
        <Marker key={`bunny-care-${bunnyCare.id || bunnyCare.name}`} position={[bunnyCare.latitude, bunnyCare.longitude]} icon={bunnyCareIcon}>
          <Popup>
            <div style={{ minWidth: '200px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#2d3748' }}>
                🐰 {bunnyCare.name}
                <div style={{ fontWeight: 'normal', fontSize: '0.95em', color: '#4a5568', marginTop: '2px' }}>
                  ({bunnyCare.latitude.toFixed(5)}, {bunnyCare.longitude.toFixed(5)})
                </div>
              </div>
              <div style={{ marginBottom: '12px', padding: '8px', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
                <span style={{ fontWeight: 'bold', color: '#dc2626' }}>Bunny Care Location</span>
                <div style={{ fontSize: '0.9em', color: '#7f1d1d', marginTop: '4px' }}>
                  Professional bunny care services available here
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Grouped post markers */}
      {Object.entries(groupedPosts).map(([key, postsAtLocation]) => {
        const { latitude, longitude, name } = postsAtLocation[0].location!;
        const isUserLocation =
          userPosition &&
          latitude.toFixed(5) === userPosition[0].toFixed(5) &&
          longitude.toFixed(5) === userPosition[1].toFixed(5);
        return (
          <Marker key={key} position={[latitude, longitude]}>
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#2d3748' }}>
                  📍 {name}
                  <div style={{ fontWeight: 'normal', fontSize: '0.95em', color: '#4a5568', marginTop: '2px' }}>
                    ({latitude.toFixed(5)}, {longitude.toFixed(5)})
                  </div>
                </div>
                {isUserLocation && (
                  <div style={{ marginBottom: '12px', padding: '8px', background: '#f7fafc', borderRadius: '6px' }}>
                    <span style={{ fontWeight: 'bold' }}>Your Location</span>
                  </div>
                )}
                {postsAtLocation.map(post => (
                  <div key={post.id} style={{ marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      {post.user ? `${post.user.name} ${post.user.surname}` : 'Anonymous'}
                    </h3>
                    <p>{post.description}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post"
                        style={{ width: '100%', height: 'auto', marginTop: '10px', borderRadius: '8px' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;