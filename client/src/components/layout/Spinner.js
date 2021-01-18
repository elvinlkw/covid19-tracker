import React from 'react';
import spinner from './spinner.gif';

const Spinner = () => {
  return (
    <div style={style}>
      <img style={{width: '40px'}} src={spinner} alt="Loading..."/>
    </div>
  )
}

const style = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

export default Spinner;