import React, { memo, useEffect, useState } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polygon
} from '@react-google-maps/api';
import Button from '@/components/Button';
import renameKeys from '@/helpers/renameKeys';
import Loader from '../Loader/index';

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

const MapActionPlotArea = ({
  onClick,
  initialPosition = [],
  initialPath = []
}) => {
  const [center, setCenter] = useState([]);
  const [path, setPath] = useState([]);
  const [windowMaps, setWindowMaps] = useState(null);
  const [libraries] = useState(['geometry']);

  useEffect(() => {
    if (initialPosition.length > 1) {
      const centerObj = {
        lat: Number(initialPosition[0]),
        lng: Number(initialPosition[1])
      };

      initialPosition = [centerObj.lat, centerObj.lng];

      const keysMap = {
        latitude: 'lat',
        longitude: 'lng'
      };

      const initialPathProps = [];

      initialPath.forEach(pathEl => {
        delete pathEl.id;
        pathEl.latitude = Number(pathEl.latitude);
        pathEl.longitude = Number(pathEl.longitude);
        initialPathProps.push(renameKeys(keysMap, pathEl));
      });

      setPath(initialPathProps);

      setCenter(centerObj);
    }
  }, []);

  const handleClick = e => {
    if (onClick !== undefined) {
      const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      const keysMap = {
        lat: 'latitude',
        lng: 'longitude'
      };

      setPath(prevPath => [...prevPath, pos]);

      onClick(renameKeys(keysMap, pos));
    }
  };

  const handleAreaCalc = () => {
    if (windowMaps !== null) {
      const mvcArray = new windowMaps.MVCArray();

      path.forEach(el => {
        mvcArray.push(new windowMaps.LatLng(el));
      });
    }
  };

  const reset = () => {
    if (onClick !== undefined) {
      setPath([]);

      onClick([]);
    }
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAfjeouEb4FznjXbL5UxsGSQi-QLxccFYA',
    libraries
  });

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={17}
        onClick={handleClick}
        mapTypeId="satellite"
        onLoad={() => {
          setWindowMaps(window.google.maps);
        }}
      >
        {path.length > 0 &&
          path.map(({ lat, lng }, i) => (
            <Marker key={i.toString()} position={{ lat, lng }} />
          ))}

        {path.length > 0 && <Polygon paths={path} options={options} />}
      </GoogleMap>

      {onClick !== undefined && (
        <Button type="button" className="primary" onClick={() => reset()}>
          Limpar desenho
        </Button>
      )}
    </>
  ) : (
    <Loader />
  );
};

export default memo(MapActionPlotArea);
