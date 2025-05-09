import React, { memo, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import Loader from '@/components/Loader';

const containerStyle = {
  width: '100%',
  height: '500px'
};

function MapWrapper({ children, onClick, center = [], zoom = 8, ...rest }) {
  const [libraries] = useState(['geometry']);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GMAPS_KEY,
    libraries
  });

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onClick={onClick}
        {...rest}
      >
        {children}
      </GoogleMap>
    </>
  ) : (
    <Loader />
  );
}

export default memo(MapWrapper);
