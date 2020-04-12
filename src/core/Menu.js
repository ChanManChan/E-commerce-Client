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
import { itemTotal } from './cartHelpers';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    marginRight: '.9rem',
  },
}));

const isActive = (history, path, breakPoint_480px) => {
  if (history.location.pathname === path)
    return !breakPoint_480px
      ? { backgroundColor: '#607d8b', color: '#fff' }
      : {
          border: '3px solid #444',
          backgroundColor: '#f4f4f4',
          color: '#3b5998',
          margin: '.3rem',
        };
  else
    return !breakPoint_480px
      ? { backgroundColor: '#f44336', color: '#fff' }
      : {
          border: '3px solid #444',
          color: '#fff',
          margin: '.3rem',
        };
};
const isCartActive = (history, path) => {
  if (history.location.pathname === path)
    return { color: '#607d8b', marginRight: '1.18rem' };
  else return { color: '#fff', marginRight: '1.18rem' };
};
const Menu = ({ history }) => {
  const classes = useStyles();
  const breakPoint_480px = useMediaQuery('(max-width:480px)');
  const dynamicStyling = () =>
    breakPoint_480px
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
              variant={!breakPoint_480px ? 'contained' : 'outlined'}
              className={!breakPoint_480px ? classes.button : ''}
              style={isActive(history, '/', breakPoint_480px)}
              to='/'
            >
              Home
            </Button>
            <Button
              component={Link}
              variant={!breakPoint_480px ? 'contained' : 'outlined'}
              className={!breakPoint_480px ? classes.button : ''}
              style={isActive(history, '/shop', breakPoint_480px)}
              to='/shop'
            >
              Shop
            </Button>
            {isAuthenticated() && isAuthenticated().user.role === 1 ? (
              <Button
                component={Link}
                variant={!breakPoint_480px ? 'contained' : 'outlined'}
                style={isActive(history, '/admin/dashboard', breakPoint_480px)}
                to='/admin/dashboard'
              >
                Admin Dashboard
              </Button>
            ) : (
              isAuthenticated() && (
                <Button
                  component={Link}
                  variant={!breakPoint_480px ? 'contained' : 'outlined'}
                  style={isActive(history, '/user/dashboard', breakPoint_480px)}
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
                <IconButton
                  aria-label='cart'
                  component={Link}
                  to='/cart'
                  style={isCartActive(history, '/cart')}
                >
                  <StyledBadge badgeContent={itemTotal()} color='secondary'>
                    <ShoppingCartIcon />
                  </StyledBadge>
                </IconButton>
                <Button
                  component={Link}
                  to='/'
                  variant={!breakPoint_480px ? 'contained' : 'outlined'}
                  style={isActive(history, '/signout', breakPoint_480px)}
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
                  variant={!breakPoint_480px ? 'contained' : 'outlined'}
                  style={isActive(history, '/signin', breakPoint_480px)}
                  className={!breakPoint_480px ? classes.button : ''}
                >
                  Signin
                </Button>
                <Button
                  component={Link}
                  variant={!breakPoint_480px ? 'contained' : 'outlined'}
                  style={isActive(history, '/signup', breakPoint_480px)}
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
