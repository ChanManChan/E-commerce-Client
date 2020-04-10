import React, { useState, useEffect, Fragment } from 'react';
import { FormControl, FormGroup, makeStyles } from '@material-ui/core';
import CategoryIcon from '@material-ui/icons/Category';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { FieldArray } from 'formik';
import GenericList from './GenericList';

const useStyles = makeStyles((theme) => ({
  rootSelect: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

const convertTypes = (fetchedCategories) => {
  let converted = {};
  for (let i = 0; i < fetchedCategories.length; i++)
    converted[fetchedCategories[i].name] = false;
  converted['Default'] = false;
  return converted;
};

const CustomCategoryList = ({
  fetchedCategories,
  formikCategoryArray,
  reset,
  resetChildMenu,
}) => {
  const classes = useStyles();
  const [checked, setChecked] = useState({});

  useEffect(() => {
    const object = fetchedCategories ? convertTypes(fetchedCategories) : {};
    setChecked(object);
  }, [fetchedCategories]);

  useEffect(() => {
    if (reset) {
      const object = fetchedCategories ? convertTypes(fetchedCategories) : {};
      setChecked(object);
      resetChildMenu();
    }
  }, [reset]);

  const handleToggle = (e) => {
    setChecked({ ...checked, [e.target.name]: e.target.checked });
  };

  const fieldName = 'category';
  return (
    checked && (
      <GenericList
        customClassName={classes.rootSelect}
        customIcon={<CategoryIcon />}
        customIconColor='#fff'
        primaryText='Categories'
        usedComponent='div'
      >
        <div style={{ marginLeft: '1rem' }}>
          <FormControl component='fieldset' className={classes.formControl}>
            <FormGroup>
              <FieldArray
                name={fieldName}
                render={(arrayHelpers) => (
                  <Fragment>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked['Default']}
                          onChange={(e) => {
                            handleToggle(e);
                            if (e.target.checked) arrayHelpers.push('Default');
                            else
                              arrayHelpers.remove(
                                formikCategoryArray.indexOf('Default')
                              );
                          }}
                          name='Default'
                          value='Default'
                        />
                      }
                      label='All Categories'
                    />
                    {fetchedCategories.map((c, i) => (
                      <FormControlLabel
                        key={i}
                        control={
                          <Checkbox
                            checked={checked[c.name]}
                            onChange={(e) => {
                              handleToggle(e);
                              if (e.target.checked) arrayHelpers.push(c._id);
                              else
                                arrayHelpers.remove(
                                  formikCategoryArray.indexOf(c._id)
                                );
                            }}
                            value={c._id}
                            name={c.name}
                          />
                        }
                        label={c.name}
                      />
                    ))}
                  </Fragment>
                )}
              />
            </FormGroup>
          </FormControl>
        </div>
      </GenericList>
    )
  );
};

export default CustomCategoryList;
