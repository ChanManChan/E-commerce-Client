import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';
import { makeStyles, AppBar, Toolbar, Button, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    display: 'inline',
    color: '#fff',
  },
}));

const isActive = (history, path) => {
  if (history.location.pathname === path) return 'contained';
  else return 'outlined';
};

const Menu = ({ history }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Box display='flex' justifyContent='flex-end'>
            <div>
              <Button
                component={Link}
                to='/'
                className={classes.button}
                variant={isActive(history, '/')}
                color='secondary'
              >
                Home
              </Button>
            </div>
            <div>
              <Button
                component={Link}
                to='/signin'
                className={classes.button}
                variant={isActive(history, '/signin')}
                color='secondary'
              >
                Signin
              </Button>
              <Button
                component={Link}
                to='/signup'
                className={classes.button}
                variant={isActive(history, '/signup')}
                color='secondary'
              >
                Signup
              </Button>
              <Button
                component={Link}
                to='/'
                className={classes.button}
                variant={isActive(history, '/signout')}
                color='secondary'
              >
                Signout
              </Button>
            </div>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(Menu);
