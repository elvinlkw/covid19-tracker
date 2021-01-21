import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import './style.css';
import { unsubscribe } from '../../actions/ontario/subscribe';

const Unsubscribe = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  return (
    <form className="unsubscribe" onSubmit={e => {
      e.preventDefault();
      dispatch(unsubscribe(email));
    }}>
      <div className="">
        <h3>Subscribe for Daily Updates</h3>
        <label htmlFor="unsubscribe-input">Email address</label>
        <input type="email" autoComplete="off" id="unsubscribe-input" aria-describedby="emailHelp" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit" className="btn btn-primary">Submit</button>
      </div>
    </form>
  )
}

export default Unsubscribe;