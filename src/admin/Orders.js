import React, { useState, useEffect, Fragment, useMemo } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { listOrders, getStatusValues } from './apiAdmin';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import moment from 'moment';
import GenericList from '../core/GenericList';
import ListAltIcon from '@material-ui/icons/ListAlt';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: '2rem',
    display: 'inline',
  },
  productList: {
    width: '19rem',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  productsSubList: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  chip: {
    margin: 2,
  },
}));

const Orders = () => {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const [orderStatus, setOrderStatus] = useState({});
  const { user, token } = isAuthenticated();

  const [state, setState] = useState({
    columns: [
      { title: 'Order ID', field: 'orderId' },
      { title: 'Ordered by', field: 'userName' },
      {
        title: 'Status',
        field: 'orderId',
        render: (rowData) => <DisplayStatus currentOrderId={rowData.orderId} />,
      },
      { title: 'Transaction ID', field: 'transaction_id' },
      { title: 'Amount', field: 'amount' },
      { title: ' Ordered on', field: 'orderedOn' },
      { title: ' Delivery address', field: 'address' },
      { title: ' Unique products', field: 'orderLength' },
      {
        title: ' Products',
        field: 'productList',
        cellStyle: {
          backgroundColor: '#f4f4f4',
          whiteSpace: 'nowrap',
        },
        render: (rowData) => (
          <DisplayProducts orderedProducts={rowData.productList} />
        ),
      },
    ],
    data: [],
  });

  const handleChange = (orderId) => (event) => {
    setState((currentState) => {
      let data = [...currentState.data];
      loop1: for (let i = 0; i < data.length; i++) {
        if (data[i]['orderId'] === orderId)
          data[i]['orderStatus'] = event.target.value;
        break loop1;
      }
      return { ...currentState, data };
    });
  };
  // const fetchStatusValue = (orderId, tuples) => {
  //   console.log('INSIDE FETCH STATUS VALUE FUNCTION');
  //   if (tuples.length > 0) {
  //     console.log('ORDER_ID: ', orderId);
  //     console.log('TUPLES: ', tuples);
  //     let tuple = tuples.find((obj) => obj.orderId === orderId);
  //     console.log('SEARCHING TUPLE: ', tuple);
  //     if (tuple) return tuple['orderStatus'];
  //   }
  // };

  const DisplayStatus = ({ currentOrderId }) => (
    <FormControl variant='outlined' className={classes.formControl}>
      <InputLabel htmlFor='outlined-age-native-simple'>Status</InputLabel>
      <Select
        native
        onChange={(e) => handleChange(currentOrderId, e)}
        label='Status'
        inputProps={{
          name: 'status',
          id: 'outlined-age-native-simple',
        }}
      >
        <option aria-label='None' value='' />
        {statusValues.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </Select>
    </FormControl>
  );

  const DisplayProducts = ({ orderedProducts }) => (
    <GenericList
      customClassName={classes.productList}
      customIcon={<ListAltIcon />}
      customIconColor='#f44336'
      primaryText='View products'
      usedComponent='ul'
    >
      <List className={classes.productsSubList} subheader={<li />}>
        {orderedProducts.map((singleProduct, i) => (
          <li key={`section-${i}`} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader
                style={{ color: '#009688', backgroundColor: '#f4f4f4' }}
              >
                {singleProduct.name}
              </ListSubheader>
              {Object.keys(
                (({ name, __v, ...rest }) => rest)(singleProduct)
              ).map((key, index) =>
                key === 'createdAt' || key === 'updatedAt' ? (
                  <ListItem key={index}>
                    <ListItemText
                      primary={key}
                      secondary={moment(
                        (({ name, __v, ...rest }) => rest)(singleProduct)[key]
                      ).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                    />
                  </ListItem>
                ) : key === 'price' ? (
                  <ListItem key={index}>
                    <ListItemText
                      primary={key}
                      secondary={
                        '\u20B9 ' +
                        (({ name, __v, ...rest }) => rest)(singleProduct)[key]
                      }
                    />
                  </ListItem>
                ) : (
                  <ListItem key={index}>
                    <ListItemText
                      primary={key}
                      secondary={
                        (({ name, __v, ...rest }) => rest)(singleProduct)[key]
                      }
                    />
                  </ListItem>
                )
              )}
            </ul>
          </li>
        ))}
      </List>
    </GenericList>
  );

  const CustomTable = () => (
    <MaterialTable
      title='Order Details'
      columns={state.columns}
      data={state.data}
      options={{
        headerStyle: {
          backgroundColor: '#01579b',
          color: '#FFF',
          whiteSpace: 'nowrap',
        },
      }}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
    />
  );

  const loadStatusValues = (userId, token) => {
    getStatusValues(userId, token).then((response) => {
      if (response.error)
        toast.error(`${response.error}`, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      else setStatusValues(response);
    });
  };

  const loadOrders = (userId, token) => {
    listOrders(userId, token).then((response) => {
      if (response.error)
        toast.error(`${response.error}`, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      else setOrders(response);
    });
  };

  useEffect(() => {
    loadOrders(user._id, token);
    loadStatusValues(user._id, token);
  }, []);

  useEffect(() => {
    orders.map((o, i) => {
      setState((currentState) => {
        const data = [...currentState.data];
        data.push({
          orderId: o._id,
          userName: o.user.name,
          transaction_id: o.transaction_id,
          amount: '\u20B9 ' + o.amount,
          orderedOn: moment(o.createdAt).fromNow(),
          address: o.address,
          orderLength: o.products.length,
          orderStatus: o.status,
          productList: o.products,
        });
        return { ...currentState, data };
      });
    });
  }, [orders]);

  const showOrdersLength = () => {
    if (orders.length > 0)
      return (
        <Fragment>
          <div className={classes.root}>{'Total orders: '}</div>
          <strong>
            <span style={{ color: '#e53935', fontSize: '2rem' }}>
              {orders.length}
            </span>
          </strong>
          <br />
          <hr />
        </Fragment>
      );
    else
      return <div className={classes.root}>{'No orders at this moment'}</div>;
  };

  return (
    <Layout
      title='Orders'
      description={`G'day ${user.name}, manage all the orders here`}
    >
      {showOrdersLength()}
      <div style={{ width: '90vw', margin: '3rem auto 10rem auto' }}>
        {CustomTable()}
      </div>
    </Layout>
  );
};

export default Orders;
