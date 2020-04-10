import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CategoryIcon from '@material-ui/icons/Category';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core';

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
}));

const GenericList = ({ children }) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const classes = useStyles();
  return (
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
            {children}
          </ListItem>
        </List>
      </Collapse>
    </List>
  );
};

export default GenericList;
