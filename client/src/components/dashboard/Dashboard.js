import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CasesSummary from './CasesSummary';
import CasesByRegion from './CasesByRegion';
import { getOntarioCasesByRegion, getAllCases } from '../../actions/ontario';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { 
    cases_by_region,
    loading_region,
    cases,
    loading,
  } = useSelector(state => state.ontario);

  useEffect(() => {
    if(loading) {
      dispatch(getAllCases());
    }

    if(loading_region) {
      dispatch(getOntarioCasesByRegion());
    }

  }, [loading, loading_region, dispatch]);

  return (
    <div>
      <h1 className="text-center mt-3 mb-3">Cases in Ontario</h1>
      {!loading && cases !== null && cases.length > 0 && (
      <CasesSummary cases={cases} />)}
      {!loading_region && cases_by_region !== null && cases_by_region.length && (
      <CasesByRegion cases={cases_by_region} />)}
    </div>
  )
}

export default Dashboard
