import React from 'react';

const STATUS_TABS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'Pending' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' }
];

const Toolbar = ({
  search,
  onSearch,
  filterStat,
  onFilterStat,
  filterVtype,
  onFilterVtype
}) => {
  return (
    <>
      {/* Filter Tabs */}
      <div className="filter-tabs">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            className={`ftab${filterStat === tab.value ? ' active' : ''}`}
            onClick={() => onFilterStat(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + dropdowns */}
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="🔍 Search customer, vehicle number..."
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterStat}
          onChange={e => onFilterStat(e.target.value)}
        >
          <option value="">All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <select
          className="filter-select"
          value={filterVtype}
          onChange={e => onFilterVtype(e.target.value)}
        >
          <option value="">All Vehicles</option>
          <option>Hatchback</option>
          <option>Sedan</option>
          <option>SUV</option>
          <option>MUV</option>
          <option>Bike</option>
          <option>Truck</option>
        </select>
      </div>
    </>
  );
};

export default Toolbar;
