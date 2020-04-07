import React, { useState } from 'react';
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

  const handleToggle = (c) => (e) => {
    // returns the first index or '-1'
    const currentCategoryId = checked.indexOf(c);
    const newCheckedCategoryId = [...checked];
    // if currently checked was not already in the checked state > push
    // else pull/take off
    if (currentCategoryId === -1) newCheckedCategoryId.push(c);
    else newCheckedCategoryId.splice(currentCategoryId, 1);
    // console.log('FROM CHECKBOX: ', newCheckedCategoryId);
    setChecked(newCheckedCategoryId);
    handleFilters(newCheckedCategoryId, e.target.name);
  };

  return categories.map((c, i) => (
    <li key={i} className='list-unstyled'>
      <FormControlLabel
        control={
          <CustomCheckbox
            onChange={handleToggle(c._id)}
            name='checkedCategory'
          />
        }
        label={c.name}
      />
    </li>
  ));
};

export default CategoryCheckbox;
