import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core';
import ListSubheader from '@material-ui/core/ListSubheader';

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const GenericList = ({
  children,
  subHeader,
  customClassName,
  customIcon,
  customIconColor,
  primaryText,
  usedComponent,
}) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const classes = useStyles();
  return (
    <List
      component='nav'
      aria-labelledby='nested-list-subheader'
      subheader={
        subHeader ? (
          <ListSubheader component='div' id='nested-list-subheader'>
            {subHeader}
          </ListSubheader>
        ) : (
          ''
        )
      }
      className={customClassName}
    >
      <ListItem button onClick={handleClick}>
        <ListItemIcon style={{ color: `${customIconColor}` }}>
          {customIcon}
        </ListItemIcon>
        <ListItemText primary={primaryText} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <List component={usedComponent} disablePadding>
          <ListItem button className={classes.nested}>
            {children}
          </ListItem>
        </List>
      </Collapse>
    </List>
  );
};

export default GenericList;
