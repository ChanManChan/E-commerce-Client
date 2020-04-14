import React, { useState, useEffect, Fragment } from 'react';
import { isAuthenticated } from '../auth';
import PaymentIcon from '@material-ui/icons/Payment';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import { green, cyan } from '@material-ui/core/colors';
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import { Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { Link } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  getBrainTreeClientToken,
  processPayment,
  createOrder,
} from './apiCore';
import { toast } from 'react-toastify';
import DropIn from 'braintree-web-drop-in-react';
import { emptyCart } from './cartHelpers';
import TextField from '@material-ui/core/TextField';
import * as yup from 'yup';

function PaperComponent(props) {
  return (
    <Draggable
      handle='#draggable-dialog-title'
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const useStyles = makeStyles((theme) => ({
  textAreaStyle: {
    marginBottom: '1rem',
  },
  margin: {
    marginLeft: '1rem',
    marginTop: '1rem',
    padding: '1rem',
  },
  breakPoint_537pxMargin: {
    marginLeft: '1rem',
    marginTop: '1rem',
    padding: '.5rem',
  },
  chip: {
    marginTop: '1rem',
    padding: '2rem',
    '& > *': {
      fontSize: '2rem',
    },
    '& > svg': {
      width: '2rem',
      height: '2rem',
    },
  },
  breakPoint_537pxChip: {
    marginTop: '1rem',
    padding: '1.5rem',
    '& > *': {
      fontSize: '1.5rem',
    },
    '& > svg': {
      width: '1.5rem',
      height: '1.5rem',
    },
  },
}));

const themeCheckout = createMuiTheme({
  palette: {
    primary: green,
  },
});
const themeNoAuth = createMuiTheme({
  palette: {
    primary: cyan,
  },
});

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
  const classes = useStyles();
  const breakPoint_537px = useMediaQuery('(max-width:537px)');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    clientToken: null,
    instance: {},
    address: '',
    loadCustom: false,
    submittingStatus: false,
    buttonText: 'Checkout',
    error: '',
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getBraintreeToken = (userId, token) => {
    getBrainTreeClientToken(userId, token).then((response) => {
      if (response.error)
        toast.error(`${response.error}`, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      else {
        setData({ ...data, clientToken: response.clientToken });
      }
    });
  };

  useEffect(() => {
    getBraintreeToken(userId, token);
  }, []);

  useEffect(() => {
    if (data.loadCustom) {
      let customDropIn = document.getElementsByClassName(
        'braintree-form__field-group'
      );
      for (let i = 0; i < customDropIn.length; i++) {
        let parent = customDropIn[i];
        let children = parent.childNodes;
        for (let j = 0; j < children.length; j++) {
          if (children[j].tagName === 'LABEL')
            children[j].classList.add('e-commerce-label');
        }
      }
      let customLabel = document.getElementsByClassName('e-commerce-label');
      for (let k = 0; k < customLabel.length - 1; k++)
        customLabel[k].style.width = '100%';
    }
  }, [data.loadCustom]);

  const buy = () => {
    /**
     * send the 'nonce' to your server
     * nonce = data.instance.requestPaymentMethod()
     */
    setData({ ...data, submittingStatus: true, buttonText: 'Processing' });
    data.instance
      .requestPaymentMethod()
      .then((result) => {
        // Once you have nonce (card type, card number), send nonce as 'paymentMethodNonce'
        // and also total to be charged
        // console.log("SEND NONCE AND TOTAL TO PROCESS: ", nonce, getTotal(products))
        // SEND NONCE AND TOTAL TO PROCESS:  tokencc_bh_m9ffww_h5xbx7_khrv7c_vczw7d_hp5 865... this is what we need to send to our backend to finalize the payment.
        const paymentData = {
          paymentMethodNonce: result.nonce,
          amount: getTotal(products),
        };
        processPayment(userId, token, paymentData)
          .then((response) => {
            if (response.success) {
              // Create order (POST request to the backend to create a new order)
              const createOrderData = {
                products,
                transaction_id: response.transaction.id,
                amount: response.transaction.amount,
                address: data.address,
              };
              createOrder(userId, token, createOrderData);

              toast.success('Payment Successfully Received!', {
                position: toast.POSITION.BOTTOM_LEFT,
              });
              // Empty cart
              emptyCart(() => {
                setRun(!run);
                toast.info('Cart is Empty', {
                  position: toast.POSITION.BOTTOM_LEFT,
                });
              });
            }
            setData({
              ...data,
              submittingStatus: false,
              buttonText: 'Checkout',
            });
          })
          .catch((err) => {
            setData({
              ...data,
              submittingStatus: false,
              buttonText: 'Checkout',
            });
            console.log(err);
          });
      })
      .catch((error) => {
        setData({ ...data, submittingStatus: false, buttonText: 'Checkout' });
        toast.error(`${error.message}`, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      });
  };

  let schema = yup.object({
    address: yup.string().required('Shipping address is required').max(100),
  });

  const validateAddress = (e) => {
    schema
      .validate({
        address: e.target.value,
      })
      .then(function (valid) {
        setData({ ...data, error: '', address: valid.address });
      })
      .catch(function (err) {
        setData({
          ...data,
          error: err.errors[0],
        });
      });
  };

  const showDropIn = () => (
    <Fragment>
      {data.clientToken !== null && products.length > 0 ? (
        <Fragment>
          <ThemeProvider theme={themeCheckout}>
            <TextField
              className={classes.textAreaStyle}
              label='Delivery Address'
              variant='outlined'
              fullWidth
              helperText={data.error}
              error={!!data.error}
              name='address'
              rows={4}
              rowsMax={Infinity}
              multiline={true}
              value={data.address}
              onChange={(e) => {
                validateAddress(e);
              }}
              id='mui-theme-provider-outlined-input'
            />
          </ThemeProvider>
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: 'vault',
              },
            }}
            onInstance={(instance) =>
              setData({ ...data, instance, loadCustom: true })
            }
          />
          <ThemeProvider theme={themeCheckout}>
            <Button
              variant='outlined'
              color='primary'
              onClick={buy}
              disabled={data.submittingStatus}
              className={
                breakPoint_537px
                  ? classes.breakPoint_537pxMargin
                  : classes.margin
              }
              startIcon={<PaymentIcon />}
            >
              {data.buttonText}
            </Button>
          </ThemeProvider>
        </Fragment>
      ) : null}
    </Fragment>
  );

  const getTotal = () => {
    return products.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.count * currentValue.price;
    }, 0);
  };

  const handleDelete = () => {
    if (typeof window !== undefined)
      if (localStorage.getItem('cart')) localStorage.removeItem('cart');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const customAlertPopup = () => (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
        Clear Cart
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Clear out your cart and return back to{' '}
          <span className='text-danger'>Home page</span>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleDelete} component={Link} to='/' color='primary'>
          Clear All
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    products &&
    products.length > 0 && (
      <div>
        <Grid container xs direction='column' spacing={3}>
          <Grid item xs>
            <Chip
              icon={<Icon>delete_sweep</Icon>}
              label={`Total: \u20B9 ${getTotal()}`}
              onDelete={handleClickOpen}
              color='secondary'
              className={
                breakPoint_537px ? classes.breakPoint_537pxChip : classes.chip
              }
            />
            {customAlertPopup()}
          </Grid>
          <Grid item xs>
            {isAuthenticated() ? (
              showDropIn()
            ) : (
              <ThemeProvider theme={themeNoAuth}>
                <Button
                  variant='outlined'
                  color='primary'
                  component={Link}
                  to='/signin'
                  className={
                    breakPoint_537px
                      ? classes.breakPoint_537pxMargin
                      : classes.margin
                  }
                  startIcon={<ExitToAppIcon />}
                >
                  Sign in to Checkout
                </Button>
              </ThemeProvider>
            )}
          </Grid>
        </Grid>
      </div>
    )
  );
};

export default Checkout;
