import React, { Fragment } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import EmailIcon from '@material-ui/icons/Email';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: '2rem',
  },
  breakPoint_430pxRoot: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: '1.5rem',
  },
  userInfo: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const CustomUserInfo = ({ userData: { _id, name, email, role } }) => {
  const classes = useStyles();
  const breakPoint_430px = useMediaQuery('(max-width:430px)');
  return (
    <Fragment>
      <div
        className={
          breakPoint_430px ? classes.breakPoint_430pxRoot : classes.root
        }
        style={{ margin: '.6rem', whiteSpace: 'nowrap' }}
      >
        {'Account Information'}
      </div>
      <List className={classes.userInfo}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <FingerprintIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='User ID' secondary={_id} />
        </ListItem>
        <Divider variant='inset' component='li' />
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AccountBoxIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='User name' secondary={name} />
        </ListItem>
        <Divider variant='inset' component='li' />
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <EmailIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='Registered email' secondary={email} />
        </ListItem>
        <Divider variant='inset' component='li' />
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <SupervisorAccountIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary='Role'
            secondary={role === 1 ? 'Admin' : 'Registered User'}
          />
        </ListItem>
      </List>
    </Fragment>
  );
};

export default CustomUserInfo;
