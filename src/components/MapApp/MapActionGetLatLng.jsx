import React, { memo, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

function MapActionGetLatLng({ onClick, positions = [] }) {
  const [position, setPosition] = useState([]);
  const [center, setCenter] = useState({
    lat: -3.7397479,
    lng: -38.5095142
  });

  useEffect(() => {
    if (positions.length > 1) {
      positions = [Number(positions[0]), Number(positions[1])];

      setPosition(positions);
      setCenter({
        lat: Number(positions[0]),
        lng: Number(positions[1])
      });
    }
  }, []);

  const handleClick = e => {
    if (onClick !== undefined) {
      const pos = [e.latLng.lat(), e.latLng.lng()];

      onClick(pos);
      setPosition(pos);
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAfjeouEb4FznjXbL5UxsGSQi-QLxccFYA">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={8}
        onClick={handleClick}
      >
        {position.length > 1 && (
          <Marker position={{ lat: position[0], lng: position[1] }} />
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default memo(MapActionGetLatLng);
