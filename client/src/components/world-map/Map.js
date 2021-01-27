import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LocationMarker from './LocationMarker';
import InfoBox from './InfoBox';
import Spinner from '../layout/Spinner';
import { getAllCountriesData } from '../../actions/countries';
import { MAP_API } from '../../constants/constants';
import './map.css';

const Map = ({ center, zoom }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { countries, loading } = useSelector(state => state.countries);
  const [infoSelected, setInfoSelected] = useState(null);

  useEffect(() => {
    if(loading) {
      dispatch(getAllCountriesData());
    }
  }, [dispatch, loading]);

  return loading ? <Spinner /> : (
    <div className="map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: MAP_API }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        {countries.map((country, index) => {
          const { countryInfo: { lat, long, flag } } = country;
          return (
          <LocationMarker 
            key={index}
            lat={lat} 
            lng={long} 
            img={flag}
            name={country.country}
            onclick={() => setInfoSelected(country)} />
        )})}
      </GoogleMapReact>
      <button className="btn btn-info" onClick={() => history.goBack()}><i className="fas fa-angle-left"/> Go Back</button>
      {infoSelected && <InfoBox info={infoSelected} onclick={() => setInfoSelected(null)} />}
    </div>
  )
}

Map.defaultProps = {
  center: {
    lat: 60,
    lng: -95
  },
  zoom: 4
}

export default Map;