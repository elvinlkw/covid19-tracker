import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { subscribe } from '../../../actions/ontario/subscribe';
import './subscribe.css';

const Subscribe = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');

  const handleChange = e => setEmail(e.target.value);

  // Handler for Subscribing
  const handleSubmit = e => {
    e.preventDefault();
    dispatch(subscribe(email, setEmail));
  }

  return (
    <div className="subscription-wrapper">
      <h3>Subscribe for Daily Updates</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" autoComplete="off" placeholder="Email Address" value={email} onChange={handleChange} />
        <input type="submit" value="Subscribe" />
      </form>
    </div>
  )
}

export default Subscribe;