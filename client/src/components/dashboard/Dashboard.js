import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CasesSummary from './CasesSummary';
import CasesByRegion from './CasesByRegion';
// import Chart from './Chart';
import Spinner from '../layout/Spinner';
import { getOntarioCasesByRegion, getAllCases } from '../../actions/ontario';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { 
    cases_by_region,
    loading_region,
    cases,
    loading
  } = useSelector(state => state.ontario);

  useEffect(() => {
    if(loading_region) {
      dispatch(getOntarioCasesByRegion());
    }
    if(loading) {
      dispatch(getAllCases());
    }
  }, [dispatch, loading, loading_region]);

  return (
    <div>
      {!loading && cases !== null && cases.length > 0 
      ? (<CasesSummary cases={cases} />)
      : <Spinner />}
  
      {!loading_region && cases_by_region !== null && cases_by_region.length  &&
      (<CasesByRegion cases={cases_by_region} />)}
      {/* <Chart /> */}
    </div>
  )
}

export default Dashboard
