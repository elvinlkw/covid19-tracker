import React from 'react';

const LocationMarker = ({ lat, lng, name, img, onclick }) => {
  return (
    <div className="location-marker" onClick={onclick} data-toggle="tooltip" data-placement="top" data-delay="0" title={name}>
      <img src={img} alt="Flag"/>
    </div>
  )
}

export default LocationMarker;