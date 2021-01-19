import React, { Fragment, useState } from 'react';
import DailyChart from './DailyChart';
import TotalChart from './TotalChart';

const Charts = () => {
  const [activeTab, setActiveTab] = useState(1);
  const TABS = [
    {
      id: 0,
      name: '7 days',
      value: 7
    }, {
      id: 1,
      name: '30 days',
      value: 30
    }, {
      id: 2,
      name: '6 months',
      value: 180
    }, {
      id: 3,
      name: 'all time',
      value: -1
    }
    
  ];
  return (
    <Fragment>
      <ul className="tabs">
        <span>Filter By: </span>
        {TABS.map(tab => (
          <li className={`${activeTab === tab.id && 'tabs-active'}`} onClick={() => setActiveTab(tab.id)} key={tab.id}>{tab.name}</li>
        ))}
      </ul>
      <div className="charts mb-5">
        <DailyChart filter={TABS[activeTab].value} />
        <TotalChart filter={TABS[activeTab].value} />
      </div>
    </Fragment>
  )
}

export default Charts
