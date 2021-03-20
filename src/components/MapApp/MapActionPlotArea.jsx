import React, { memo, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';
import Button from '@/components/Button';
import renameKeys from '@/helpers/renameKeys';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const options = {
  fillColor: 'red',
  fillOpacity: 0.25,
  strokeColor: 'red',
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
};

function MapActionPlotArea({ onClick, initialPosition = [] }) {
  const [center, setCenter] = useState([]);
  const [path, setPath] = useState([]);

  useEffect(() => {
    if (initialPosition.length > 1) {
      const centerObj = {
        lat: Number(initialPosition[0]),
        lng: Number(initialPosition[1])
      };

      initialPosition = [centerObj.lat, centerObj.lng];

      setCenter(centerObj);
    }
  }, []);

  const handleClick = e => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    const keysMap = {
      lat: 'latitude',
      lng: 'longitude'
    };

    setPath(prevPath => [...prevPath, pos]);

    if (onClick !== undefined) onClick(renameKeys(keysMap, pos));
  };

  const reset = () => {
    setPath([]);

    if (onClick !== undefined) onClick([]);
  };

  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyAfjeouEb4FznjXbL5UxsGSQi-QLxccFYA">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={17}
          onClick={handleClick}
          mapTypeId="satellite"
        >
          {path.length > 0 &&
            path.map(({ lat, lng }, i) => (
              <Marker key={i.toString()} position={{ lat, lng }} />
            ))}

          {path.length > 0 && <Polygon paths={path} options={options} />}
        </GoogleMap>
      </LoadScript>
      <Button type="button" className="primary" onClick={() => reset()}>
        Limpar desenho
      </Button>
    </>
  );
}

export default memo(MapActionPlotArea);
