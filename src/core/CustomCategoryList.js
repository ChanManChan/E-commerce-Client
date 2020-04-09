import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CategoryIcon from '@material-ui/icons/Category';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { FormControl, FormGroup, makeStyles } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  rootSelect: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },

  formControl: {
    margin: theme.spacing(3),
  },
}));

const convertTypes = (array) => {
  let converted = {};
  for (let i = 0; i < array.length; i++) converted[array[i].name] = false;
  converted['Default'] = false;
  return converted;
};

const CustomCategoryList = ({ name, onChange, array }) => {
  const classes = useStyles();
  const [checked, setChecked] = useState({});
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  useEffect(() => {
    const object = array ? convertTypes(array) : {};
    setChecked(object);
  }, [array]);
  const handleChange = (event) => {
    setChecked({ ...checked, [event.target.name]: event.target.checked });
  };
  return (
    checked && (
      <List
        component='nav'
        aria-labelledby='nested-list-subheader'
        className={classes.rootSelect}
      >
        <ListItem button onClick={handleClick}>
          <ListItemIcon style={{ color: '#fff' }}>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary='Categories' />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem button className={classes.nested}>
              <div style={{ marginLeft: '1rem' }}>
                <FormControl
                  component='fieldset'
                  className={classes.formControl}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked['Default']}
                          onChange={handleChange}
                          name='Default'
                          value='Default'
                        />
                      }
                      label='All Categories'
                    />
                    {array.map((c, i) => (
                      <div key={i}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={checked[c.name]}
                              onChange={handleChange}
                              value={c._id}
                              name={c.name}
                            />
                          }
                          label={c.name}
                        />
                      </div>
                    ))}
                  </FormGroup>
                </FormControl>
              </div>
            </ListItem>
          </List>
        </Collapse>
      </List>
    )
  );
};

export default CustomCategoryList;
