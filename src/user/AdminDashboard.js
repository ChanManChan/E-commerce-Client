import React from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

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
const AdminDashboard = () => {
  const classes = useStyles();
  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  const adminLinks = () => (
    <Grid item xs>
      <div className='card' style={{ maxWidth: '24rem', margin: '0 auto' }}>
        <h4 className='card-header'>Admin Links</h4>
        <ul className='list-group'>
          <li className='list-group-item'>
            <Button
              variant='contained'
              color='secondary'
              component={Link}
              to='/create/category'
              size='large'
              className={classes.button2}
              startIcon={<AccountTreeIcon />}
            >
              Create Category
            </Button>
          </li>
          <li className='list-group-item'>
            <Button
              variant='contained'
              color='primary'
              component={Link}
              to='/create/product'
              size='large'
              className={classes.button1}
              startIcon={<AddBoxIcon />}
            >
              Create Product
            </Button>
          </li>
        </ul>
      </div>
    </Grid>
  );

  const adminInfo = () => (
    <Grid item xs>
      <div className='card' style={{ maxWidth: '85rem', margin: '0 auto' }}>
        <h3 className='card-header'>User Information</h3>
        <ul className='list-group'>
          <li className='list-group-item'>{name}</li>
          <li className='list-group-item'>{email}</li>
          <li className='list-group-item'>
            {role === 1 ? 'Admin' : 'Registered User'}
          </li>
        </ul>
      </div>
    </Grid>
  );
  return (
    <Layout
      title='Dashboard'
      description={`G'day ${name}`}
      className='container-fluid'
    >
      {/* <div className='row'> */}
      <Grid container spacing={3} style={{ marginBottom: '5rem' }}>
        {adminInfo()}
        {adminLinks()}
      </Grid>
      {/* <div className='col-9'>{}</div> */}
      {/* <div className='col-3'>{}</div> */}
      {/* </div> */}
    </Layout>
  );
};

export default AdminDashboard;
