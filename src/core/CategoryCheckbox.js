import React, { useState, useEffect } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

const CustomCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color='default' {...props} />);

const CategoryCheckbox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);
  const handleToggle = (e) => {
    // returns the first index or '-1'
    const currentCategory = categories[parseInt(e.target.name.substring(15))];
    const currentCategoryIdPosition = checked.indexOf(currentCategory._id);
    const newCheckedCategoryIdArray = [...checked];
    // if currently checked was not already in the checked state > push
    // else pull/take off
    if (currentCategoryIdPosition === -1)
      newCheckedCategoryIdArray.push(currentCategory._id);
    else newCheckedCategoryIdArray.splice(currentCategoryIdPosition, 1);
    setChecked(newCheckedCategoryIdArray);
    handleFilters(newCheckedCategoryIdArray, e.target.name.substring(0, 15));
  };

  return categories.map((c, i) => (
    <div key={i}>
      <FormControlLabel
        control={
          <CustomCheckbox
            checked={checked.indexOf(c._id) !== -1}
            onChange={handleToggle}
            name={`checkedCategory${i}`}
          />
        }
        label={c.name}
      />
    </div>
  ));
};

export default CategoryCheckbox;
