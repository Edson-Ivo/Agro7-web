import React, { useState, useEffect } from 'react';
import { compose, withProps } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyAfjeouEb4FznjXbL5UxsGSQi-QLxccFYA&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `500px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    onClick={e => props.onClick(e)}
    defaultZoom={5}
    defaultCenter={{ lat: -3.7397479, lng: -38.5095142 }}
  >
    {props.position.length > 1 && (
      <Marker position={{ lat: props.position[0], lng: props.position[1] }} />
    )}
  </GoogleMap>
));

const MapActionGetLatLng = ({ onClick, positions = [] }) => {
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

  return <MyMapComponent onClick={handleClick} position={position} />;
};

export default MapActionGetLatLng;
