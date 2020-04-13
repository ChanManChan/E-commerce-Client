import React, { useState } from 'react';
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

const Checkout = ({ products }) => {
  const classes = useStyles();
  const breakPoint_537px = useMediaQuery('(max-width:537px)');
  const [open, setOpen] = useState(false);

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
          Clear out your cart and return back to home page?
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
        <Grid container xs>
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
              <ThemeProvider theme={themeCheckout}>
                <Button
                  variant='outlined'
                  color='primary'
                  className={
                    breakPoint_537px
                      ? classes.breakPoint_537pxMargin
                      : classes.margin
                  }
                  startIcon={<PaymentIcon />}
                >
                  checkout
                </Button>
              </ThemeProvider>
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
