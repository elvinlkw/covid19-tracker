import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CasesSummary from './cases-summary/CasesSummary';
import CasesByRegion from './cases-regions/CasesByRegion';
import SavedRegions from './saved-regions/SavedRegions';
import Charts from './charts/Charts';
import Subscribe from './subscribe/Subscribe';
import Footer from './footer/Footer';
import Spinner from '../layout/Spinner';
import { getOntarioCasesByRegion, getAllCases } from '../../actions/ontario';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { 
    cases_by_region,
    loading_region,
    cases,
    loading,
    saved_regions
  } = useSelector(state => state.ontario);

  const [activeTab, setActiveTab] = useState(saved_regions ? 0 : 1);

  const TABS = [
    {
      index: 0,
      name: "Saved Regions",
      icon: "bookmark"
    }, {
      index: 1,
      name: "Cases By Region",
      icon: "folder-open"
    }, {
      index: 2,
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
  }, [dispatch, loading_region]);

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
        
        {activeTab === 1 && !loading_region && cases_by_region !== null && cases_by_region.length > 0 && 
        <CasesByRegion />}
        {activeTab === 0 && !loading_region && cases_by_region !== null && cases_by_region.length > 0 && 
        <SavedRegions />}
        {activeTab === 2 && <Charts cases={cases} />}
        {!loading_region && 
        <>
        <Subscribe />
        <Footer />
        </>}
      </Fragment>)
      : <Spinner />}
    </>
  )
}

export default Dashboard