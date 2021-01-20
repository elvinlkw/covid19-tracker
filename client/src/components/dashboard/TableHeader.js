import React from 'react'

const TableHeader = ({ value, name, sortedField, sortedConfig, onSort, style='' }) => (
  <th scope="col" onClick={() => onSort(value)} style={{...tableHeaderStyle, ...style}}>
    {name} {sortedField === value && <i className={`fas fa-caret-${sortedConfig}`}></i>}
  </th>
)

const tableHeaderStyle = {
  userSelect: 'none',
  cursor: 'pointer'
}

export default TableHeader;