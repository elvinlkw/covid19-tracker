import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import { unsubscribe, subReset } from '../../actions/ontario/subscribe';
import QueryString from 'query-string';

const Unsubscribe = ({ location }) => {
  const dispatch = useDispatch();
  const isUnsubbed = useSelector(state => state.subscribe);
  const [email, setEmail] = useState('');
  const parsed = QueryString.parse(location.search);

  useEffect(() => {
    if(parsed.email && parsed.token) {
      dispatch(unsubscribe(parsed.email, parsed.token));
    }
    return () => {
      dispatch(subReset());
    }
  }, []);

  return (
    <form className="unsubscribe" onSubmit={e => {
      e.preventDefault();
      dispatch(unsubscribe(email, parsed.token));
    }}>
      <div>
        <h3>{!isUnsubbed ? 'Unsubscribe' : 'Successfully Unsubscribed'} from Daily Updates</h3>
        {!isUnsubbed && 
        <Fragment>
          <label htmlFor="unsubscribe-input">Email address</label>
          <input type="email" autoComplete="off" id="unsubscribe-input" aria-describedby="emailHelp" value={email} onChange={e => setEmail(e.target.value)} />
          <button type="submit" className="btn btn-primary">Submit</button>
        </Fragment>}
      </div>
    </form>
  )
}

export default Unsubscribe;