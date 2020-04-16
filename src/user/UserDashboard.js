import React from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
}));
const UserDashboard = () => {
  const classes = useStyles();
  const breakPoint_750px = useMediaQuery('(max-width:750px)');

  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  const userLinksStyling = () => (breakPoint_750px ? '85rem' : '24rem');

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

  const userInfo = () => (
    // <Grid item xs>
    <div className='card mb-5' style={{ maxWidth: '85rem', margin: '0 auto' }}>
      <h3 className='card-header'>User Information</h3>
      <ul className='list-group'>
        <li className='list-group-item'>{name}</li>
        <li className='list-group-item'>{email}</li>
        <li className='list-group-item'>
          {role === 1 ? 'Admin' : 'Registered User'}
        </li>
      </ul>
    </div>
    // </Grid>
  );
  const purchaseHistory = () => (
    // <Grid item xs>
    <div className='card mb-5' style={{ margin: '0 auto' }}>
      <h3 className='card-header'>Purchase history</h3>
      <ul className='list-group'>
        <li className='list-group-item'>History</li>
      </ul>
    </div>
    // </Grid>
  );
  return (
    <Layout
      title='Dashboard'
      description={`G'day ${name}`}
      className='container-fluid'
    >
      {/* <div className='row'> */}
      <Grid
        container
        spacing={3}
        style={{ marginBottom: '5rem' }}
        direction={breakPoint_750px ? 'column' : 'row'}
      >
        <Grid item xs>
          {userInfo()}
          {purchaseHistory()}
        </Grid>
        {userLinks()}
      </Grid>
      {/* <div className='col-3'></div> */}
      {/* <div className='col-9'> */}
      {/* </div> */}
      {/* </div> */}
    </Layout>
  );
};

export default UserDashboard;
