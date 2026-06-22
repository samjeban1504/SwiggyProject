import React from 'react';
import { BiSearch } from 'react-icons/bi';

const SearchBar = ({ value, onChange, placeholder = 'Search restaurants, cuisines...' }) => {
  return (
    <div className="input-group mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <span className="input-group-text glass-input border-end-0 px-3">
        <BiSearch size={22} className="text-warning" />
      </span>
      <input
        type="text"
        className="form-control glass-input border-start-0 ps-0"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
