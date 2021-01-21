import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { subscribe } from '../../actions/ontario/subscribe';
import './style.css';

const Subscribe = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState('');
  return (
    <form className="unsubscribe" onSubmit={e => {
      e.preventDefault();
      dispatch(subscribe(email));
    }}>
      <div className="">
        <h3>Subscribe for Daily Updates</h3>
        <label htmlFor="input">Email address</label>
        <input type="email" autoComplete="off" id="input" aria-describedby="emailHelp" value={email} onChange={e => setEmail(e.target.value)} />
        <div>
          <button type="button" className="btn btn-danger" style={{marginRight: '0.5rem'}} onClick={() => history.goBack()}>Cancel</button>
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </div>
    </form>
  )
}

export default Subscribe;