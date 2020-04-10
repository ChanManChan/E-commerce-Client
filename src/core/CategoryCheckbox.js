import React, { useEffect, useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import persistedState from 'use-persisted-state';
const usePersistedState = persistedState('clState');

const CustomCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color='default' {...props} />);

const convertTypes = (array) => {
  let converted = {};
  for (let i = 0; i < array.length; i++) converted[array[i].name] = false;
  return converted;
};

const CategoryCheckbox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);
  const [toggled, setToggled] = usePersistedState({});
  useEffect(() => {
    const object = JSON.parse(localStorage.getItem('clState'))
      ? JSON.parse(localStorage.getItem('clState'))
      : categories
      ? convertTypes(categories)
      : {};
    setToggled(object);
  }, [categories]);

  const handleToggle = (cId) => (e) => {
    // const currentCategory = categories[parseInt(e.target.name.substring(15))];
    setToggled({ ...toggled, [e.target.name]: e.target.checked });
    // returns the first index or '-1'
    const currentCategoryIdPosition = checked.indexOf(cId);
    const newCheckedCategoryIdArray = [...checked];
    // if currently checked was not already in the checked state > push
    // else pull/take off
    if (currentCategoryIdPosition === -1) newCheckedCategoryIdArray.push(cId);
    else newCheckedCategoryIdArray.splice(currentCategoryIdPosition, 1);
    setChecked(newCheckedCategoryIdArray);
    handleFilters(newCheckedCategoryIdArray, 'checkedCategory');
  };
  return (
    toggled &&
    categories.map((c, i) => (
      <div key={i}>
        <FormControlLabel
          control={
            <CustomCheckbox
              checked={toggled[c.name]}
              onChange={handleToggle(c._id)}
              value={c._id}
              name={c.name}
            />
          }
          label={c.name}
        />
      </div>
    ))
  );
};

export default CategoryCheckbox;
