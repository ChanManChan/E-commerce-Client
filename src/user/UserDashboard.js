import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { getPurchaseHistory } from './apiUser';
import { toast } from 'react-toastify';
import CustomHistoryList from './CustomHistoryList';
import CustomUserInfo from './CustomUserInfo';

const useStyles = makeStyles((theme) => ({
  button1: {
    margin: theme.spacing(1),
    width: '90%',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#6200ea',
    },
  },
  button2: {
    margin: theme.spacing(1),
    width: '90%',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#f57f17',
    },
  },
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
}));

const UserDashboard = () => {
  const classes = useStyles();
  const breakPoint_750px = useMediaQuery('(max-width:750px)');
  const breakPoint_430px = useMediaQuery('(max-width:430px)');

  const [history, setHistory] = useState([]);
  const {
    user: { _id, name, email, role },
    token,
  } = isAuthenticated();

  const userLinksStyling = () => (breakPoint_750px ? '85rem' : '24rem');

  const init = (userId, token) => {
    getPurchaseHistory(userId, token).then((data) => {
      if (data.error)
        toast.error(`${data.error}`, { position: toast.POSITION.BOTTOM_LEFT });
      else setHistory(data);
    });
  };

  useEffect(() => {
    init(_id, token);
  }, []);

  const userLinks = () => (
    <Grid item xs>
      <div
        className='card'
        style={{ maxWidth: userLinksStyling(), margin: '0 auto' }}
      >
        <h4 className='card-header'>User Links</h4>
        <ul className='list-group'>
          <li className='list-group-item'>
            <Button
              variant='contained'
              color='secondary'
              component={Link}
              to='/cart'
              size='large'
              className={classes.button2}
              startIcon={<AddShoppingCartIcon />}
            >
              My Cart
            </Button>
          </li>
          <li className='list-group-item'>
            <Button
              variant='contained'
              color='primary'
              component={Link}
              to={`/profile/${_id}`}
              size='large'
              className={classes.button1}
              startIcon={<SaveIcon />}
            >
              Update Profile
            </Button>
          </li>
        </ul>
      </div>
    </Grid>
  );

  const userInfo = (_id, name, email, role) => (
    <Grid item xs>
      <CustomUserInfo userData={{ _id, name, email, role }} />
    </Grid>
  );
  const purchaseHistory = (history) => (
    <Grid item xs>
      <div
        className={
          breakPoint_430px ? classes.breakPoint_430pxRoot : classes.root
        }
        style={{ margin: '.6rem', whiteSpace: 'nowrap' }}
      >
        {'Purchase history'}
      </div>
      <Grid container spacing={3}>
        <CustomHistoryList history={history} />
      </Grid>
    </Grid>
  );
  return (
    <Layout
      title='Dashboard'
      description={`G'day ${name}`}
      className='container-fluid'
    >
      <Grid
        container
        spacing={3}
        style={{ marginBottom: '5rem' }}
        direction={breakPoint_750px ? 'column' : 'row'}
      >
        {userLinks()}
        <Grid item xs>
          <Grid
            container
            spacing={3}
            direction='column'
            style={{ minWidth: '60vw' }}
          >
            {userInfo(_id, name, email, role)}
            {purchaseHistory(history)}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default UserDashboard;
