import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

const RegionItem = ({
  region: {
    id,
    health_unit_num,
    health_unit_name,
    confirmed_today,
    active_today,
    resolved_today,
    deaths_today,
    total_confirmed,
    total_resolved,
    total_deaths
  }
}) => {
  const { selected_date } = useSelector(state => state.ontario);
  return (
    <tr className="text-center">
      <td>{health_unit_num}</td>
      <td className="text-left">{health_unit_name}</td>
      {selected_date !== "Total" && 
      <Fragment>
        <td>{confirmed_today}</td>
        <td>{active_today}</td>
        <td>{resolved_today}</td>
        <td>{deaths_today}</td>
      </Fragment>}
      {selected_date === "Total" &&
      <Fragment>
        <td>{total_confirmed}</td>
        <td>{total_resolved}</td>
        <td>{total_deaths}</td>
      </Fragment>}
    </tr>
  )
}

export default RegionItem
