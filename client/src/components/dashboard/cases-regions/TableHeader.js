import React from 'react'

const TableHeader = ({ value, name, sortedField, sortedConfig, onSort, style='' }) => (
  <th scope="col" onClick={() => onSort(value)} style={{...tableHeaderStyle, ...style}}>
    <span>{name} {sortedField === value && <i className={`fas fa-caret-${sortedConfig}`}></i>}</span>
  </th>
)

const tableHeaderStyle = {
  userSelect: 'none',
  cursor: 'pointer'
}

export default TableHeader;