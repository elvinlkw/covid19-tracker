import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSavedRegion, removeSavedRegion } from '../../../actions/ontario';

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
    total_deaths,
    saved
  }
}) => {
  const dispatch = useDispatch();
  const { selected_date, saved_regions } = useSelector(state => state.ontario);

  const handleSaveRegion = () => {
    // Check if saved regions includes the one clicked
    if(saved_regions === null) {
      return dispatch(addSavedRegion({  health_unit_num, health_unit_name }));
    }

    const exist = saved_regions.filter(region => region.health_unit_num === health_unit_num);
    if(exist.length === 0) {
      dispatch(addSavedRegion({  health_unit_num, health_unit_name }));
    } else {
      dispatch(removeSavedRegion(health_unit_num));
    }
  }

  return (
    <tr className="text-center">
      <td>{health_unit_num}</td>
      <td className="text-left">
        {/* <Link to={`${health_unit_name.toLowerCase().replace(/[,. ]/g, '_')}`}> */}
          {health_unit_name}
        {/* </Link> */}
      </td>
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
      <td style={{cursor:'pointer'}} onClick={handleSaveRegion}>
        <i className={saved ? 'fas fa-star star' : 'far fa-star'} />
      </td>
    </tr>
  )
}

export default RegionItem
