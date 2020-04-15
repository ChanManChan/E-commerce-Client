import React from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { green, indigo } from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const customTheme1 = createMuiTheme({
  palette: {
    primary: green,
  },
});
const customTheme2 = createMuiTheme({
  palette: {
    primary: indigo,
  },
});

const useStyles = makeStyles((theme) => ({
  button1: {
    margin: theme.spacing(1),
    color: '#fff',
    backgroundColor: '#3f51b5',
    width: '90%',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#6200ea',
    },
  },
  breakPoint_308pxButton1: {
    margin: theme.spacing(1),
    width: '90%',
    fontSize: '.6rem',
    color: '#fff',
    backgroundColor: '#3f51b5',
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
  breakPoint_308pxButton2: {
    margin: theme.spacing(1),
    width: '90%',
    fontSize: '.6rem',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#f57f17',
    },
  },
  button3: {
    margin: theme.spacing(1),
    width: '90%',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#66bb6a',
    },
  },
  breakPoint_308pxButton3: {
    margin: theme.spacing(1),
    width: '90%',
    fontSize: '.6rem',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#66bb6a',
    },
  },
}));
const AdminDashboard = () => {
  const classes = useStyles();
  const breakPoint_609px = useMediaQuery('(max-width:609px)');
  const breakPoint_308px = useMediaQuery('(max-width:308px)');
  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  const linkStyling = () => (breakPoint_609px ? '85rem' : '24rem');

  const adminLinks = () => (
    <Grid item xs>
      <div
        className='card'
        style={{ maxWidth: linkStyling(), margin: '0 auto' }}
      >
        <h4 className='card-header'>Admin Links</h4>
        <ul className='list-group'>
          <li className='list-group-item'>
            <Button
              variant='contained'
              color='secondary'
              component={Link}
              to='/create/category'
              size='large'
              className={
                breakPoint_308px
                  ? classes.breakPoint_308pxButton2
                  : classes.button2
              }
              startIcon={<AccountTreeIcon />}
            >
              Create Category
            </Button>
          </li>
          <li className='list-group-item'>
            <Button
              variant='contained'
              component={Link}
              to='/create/product'
              size='large'
              className={
                breakPoint_308px
                  ? classes.breakPoint_308pxButton1
                  : classes.button1
              }
              startIcon={<AddBoxIcon />}
            >
              Create Product
            </Button>
          </li>
          <li className='list-group-item'>
            <ThemeProvider theme={customTheme1}>
              <Button
                variant='contained'
                color='primary'
                component={Link}
                to='/admin/orders'
                size='large'
                className={
                  breakPoint_308px
                    ? classes.breakPoint_308pxButton3
                    : classes.button3
                }
                startIcon={<VisibilityIcon />}
              >
                View Orders
              </Button>
            </ThemeProvider>
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
      <Grid
        container
        spacing={3}
        style={{ marginBottom: '5rem' }}
        direction={breakPoint_609px ? 'column' : 'row'}
      >
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
