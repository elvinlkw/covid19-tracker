import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CasesSummary from './CasesSummary';
import CasesByRegion from './CasesByRegion';
import Charts from './Charts';
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

  const [activeTab, setActiveTab] = useState(0);

  const TABS = [
    {
      index: 0,
      name: "Cases By Region",
      icon: "folder-open"
    },
    {
      index: 1,
      name: "Charts",
      icon: "chart-line"
    }
  ]

  useEffect(() => {
    if(loading_region) {
      dispatch(getOntarioCasesByRegion());
    }
    if(loading) {
      dispatch(getAllCases());
    }
  }, [dispatch, loading, loading_region]);

  const handleTab = (e, tabIndex) => {
    e.preventDefault();
    setActiveTab(tabIndex);
  }

  return (
    <>
      {!loading && cases !== null && cases.length > 0 
      ? (<Fragment>
      <CasesSummary cases={cases} />

      <ul className="nav nav-tabs mb-3">
        {TABS.map(tab => (
        <li className="nav-item" key={tab.index}>
          <a className={`nav-link ${activeTab === tab.index && 'active'}`} href="#!" onClick={e => handleTab(e, tab.index)}>
            <i style={{marginRight: '0.5rem'}} className={`fas fa-${tab.icon}`}/>{tab.name}
          </a>
        </li>
        ))}
      </ul>
      
      {activeTab === 0 && !loading_region && cases_by_region !== null && cases_by_region.length > 0 && 
      (<CasesByRegion cases={cases_by_region} />)}
      {activeTab === 1 && <Charts cases={cases} />}
      </Fragment>)
      : <Spinner />}
    </>
  )
}

export default Dashboard
