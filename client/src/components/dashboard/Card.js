import React from 'react';
import PropTypes from 'prop-types';

const Card = (
  {
    card: {
      title,
      text,
      style
    },
    children
  }
) => {
  return (
    <div className={`card col-md-3 ${style} mr-3 mb-5`}>
      <div className="card-body text-center">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{text}</p>
        <h3 className="card-title">
          {children}
        </h3>
      </div>
    </div>
  )
}

Card.propTypes = {
  card: PropTypes.object.isRequired,
}

export default Card;