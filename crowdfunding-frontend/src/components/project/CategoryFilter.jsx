import React from 'react';
import Select from '../common/Select';

const CategoryFilter = ({ categories, selectedCategory, onChange }) => {
  const options = categories.map((cat) => ({ value: cat.id, label: cat.name }));

  return (
    <Select
      options={options}
      value={selectedCategory}
      onChange={(e) => onChange(e.target.value)}
      placeholder="All Categories"
    />
  );
};

export default CategoryFilter;