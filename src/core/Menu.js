import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';
import { makeStyles, AppBar, Toolbar, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    marginRight: '.9rem',
  },
}));

const isActive = (history, path) => {
  if (history.location.pathname === path)
    return { backgroundColor: '#607d8b', color: '#fff' };
  else return { backgroundColor: '#f44336', color: '#fff' };
};

const Menu = ({ history }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <div>
            <Button
              component={Link}
              variant='contained'
              style={isActive(history, '/')}
              to='/'
            >
              Home
            </Button>
          </div>
          <div>
            {isAuthenticated() ? (
              <Fragment>
                <Button
                  component={Link}
                  to='/'
                  variant='contained'
                  style={isActive(history, '/signout')}
                  onClick={() => {
                    signout(() => {
                      history.push('/');
                    });
                  }}
                >
                  Signout
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                <Button
                  component={Link}
                  to='/signin'
                  variant='contained'
                  style={isActive(history, '/signin')}
                  className={classes.button}
                >
                  Signin
                </Button>
                <Button
                  component={Link}
                  variant='contained'
                  style={isActive(history, '/signup')}
                  to='/signup'
                >
                  Signup
                </Button>
              </Fragment>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(Menu);
