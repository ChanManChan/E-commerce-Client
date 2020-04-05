import React from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  button1: {
    margin: theme.spacing(1),
    '&:hover': {
      color: '#fff',
      backgroundColor: '#6200ea',
    },
  },
  button2: {
    margin: theme.spacing(1),
    '&:hover': {
      color: '#fff',
      backgroundColor: '#f57f17',
    },
  },
}));
const UserDashboard = () => {
  const classes = useStyles();
  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  const userLinks = () => (
    <div className='card'>
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
            to='/profile/update'
            size='large'
            className={classes.button1}
            startIcon={<SaveIcon />}
          >
            Update Profile
          </Button>
        </li>
      </ul>
    </div>
  );

  const userInfo = () => (
    <div className='card mb-5'>
      <h3 className='card-header'>User Information</h3>
      <ul className='list-group'>
        <li className='list-group-item'>{name}</li>
        <li className='list-group-item'>{email}</li>
        <li className='list-group-item'>
          {role === 1 ? 'Admin' : 'Registered User'}
        </li>
      </ul>
    </div>
  );
  const purchaseHistory = () => (
    <div className='card mb-5'>
      <h3 className='card-header'>Purchase history</h3>
      <ul className='list-group'>
        <li className='list-group-item'>History</li>
      </ul>
    </div>
  );
  return (
    <Layout
      title='Dashboard'
      description={`G'day ${name}`}
      className='container-fluid'
    >
      <div className='row'>
        <div className='col-3'>{userLinks()}</div>
        <div className='col-9'>
          {userInfo()}
          {purchaseHistory()}
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
