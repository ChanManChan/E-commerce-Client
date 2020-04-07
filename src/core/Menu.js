import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';
import {
  makeStyles,
  AppBar,
  Toolbar,
  Button,
  useMediaQuery,
} from '@material-ui/core';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    marginRight: '.9rem',
  },
}));

const isActive = (history, path, matches) => {
  if (history.location.pathname === path)
    return !matches
      ? { backgroundColor: '#607d8b', color: '#fff' }
      : {
          border: '3px solid #444',
          backgroundColor: '#f4f4f4',
          color: '#3b5998',
          margin: '.3rem',
        };
  else
    return !matches
      ? { backgroundColor: '#f44336', color: '#fff' }
      : {
          border: '3px solid #444',
          color: '#fff',
          margin: '.3rem',
        };
};

const Menu = ({ history }) => {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:385px)');
  const dynamicStyling = () =>
    matches
      ? {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }
      : { justifyContent: 'space-between' };
  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar style={dynamicStyling()}>
          <div style={dynamicStyling()}>
            <Button
              component={Link}
              variant={!matches ? 'contained' : 'outlined'}
              className={!matches ? classes.button : ''}
              style={isActive(history, '/', matches)}
              to='/'
            >
              Home
            </Button>
            {isAuthenticated() && isAuthenticated().user.role === 1 ? (
              <Button
                component={Link}
                variant={!matches ? 'contained' : 'outlined'}
                style={isActive(history, '/admin/dashboard', matches)}
                to='/admin/dashboard'
              >
                Admin Dashboard
              </Button>
            ) : (
              isAuthenticated() && (
                <Button
                  component={Link}
                  variant={!matches ? 'contained' : 'outlined'}
                  style={isActive(history, '/user/dashboard', matches)}
                  to='/user/dashboard'
                >
                  Dashboard
                </Button>
              )
            )}
          </div>
          <div style={dynamicStyling()}>
            {isAuthenticated() ? (
              <Fragment>
                <Button
                  component={Link}
                  to='/'
                  variant={!matches ? 'contained' : 'outlined'}
                  style={isActive(history, '/signout', matches)}
                  onClick={() => {
                    signout(() => {
                      history.push('/');
                      toast.success('Successfully signed out', {
                        position: toast.POSITION.BOTTOM_LEFT,
                      });
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
                  variant={!matches ? 'contained' : 'outlined'}
                  style={isActive(history, '/signin', matches)}
                  className={!matches ? classes.button : ''}
                >
                  Signin
                </Button>
                <Button
                  component={Link}
                  variant={!matches ? 'contained' : 'outlined'}
                  style={isActive(history, '/signup', matches)}
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
