import React, { memo, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: -3.7397479,
  lng: -38.5095142
};

function MapActionGetLatLng({ onClick, positions = [] }) {
  const [position, setPosition] = useState([]);

  useEffect(() => {
    if (positions.length > 1) {
      positions = [Number(positions[0]), Number(positions[1])];

      setPosition(positions);
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
        zoom={5}
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
