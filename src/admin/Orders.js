import React, { useState, useEffect, Fragment } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { listOrders, getStatusValues, updateOrderStatus } from './apiAdmin';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import moment from 'moment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DisplayProducts from './DisplayProducts';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: '2rem',
    display: 'inline',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const Orders = () => {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
  const { user, token } = isAuthenticated();
  const [statusValues, setStatusValues] = useState([]);

  const [state, setState] = useState({
    columns: [
      { title: 'Order ID', field: 'orderId' },
      { title: 'Ordered by', field: 'userName' },
      {
        title: 'Status',
        field: 'orderId',
        field: 'statuses',
        field: 'orderStatus',
        render: (rowData) => (
          <DisplayStatus
            currentStatus={rowData.orderStatus}
            currentOrderId={rowData.orderId}
            orderStatuses={rowData.statuses}
          />
        ),
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
      for (let i = 0; i < data.length; i++)
        if (data[i]['orderId'] === orderId)
          if (event.target.value !== '')
            data[i][event.target.name] = event.target.value;
          else
            toast.warn('Status has to be valid', {
              position: toast.POSITION.BOTTOM_LEFT,
            });
      return { ...currentState, data };
    });
    updateOrderStatus(user._id, token, orderId, event.target.value).then(
      (response) => {
        if (response.error)
          toast.error(`${response.error}`, {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        else
          toast.success('Successfully updated Database', {
            position: toast.POSITION.BOTTOM_LEFT,
          });
      }
    );
  };

  const DisplayStatus = ({ currentStatus, currentOrderId, orderStatuses }) => (
    <FormControl variant='outlined' className={classes.formControl}>
      <InputLabel htmlFor='demo-simple-select-outlined-label'>
        Status
      </InputLabel>
      <Select
        labelId='demo-simple-select-outlined-label'
        id='demo-simple-select-outlined'
        value={currentStatus}
        name='orderStatus'
        onChange={handleChange(currentOrderId)}
        label='Status'
      >
        <MenuItem value=''>
          <em>None</em>
        </MenuItem>
        {orderStatuses.map((s, i) => (
          <MenuItem key={i} value={s}>
            {s}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
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
    orders.map((o) => {
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
          statuses: statusValues,
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
