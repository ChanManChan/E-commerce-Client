import React, { useState, useEffect, Fragment } from 'react';
import Layout from './Layout';
import { getCart } from './cartHelpers';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { Grid, makeStyles } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import Button from '@material-ui/core/Button';
import Checkout from './Checkout';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    padding: '1rem',
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
  breakPoint_1112pxRoot: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: '1.4rem',
  },
}));

const Cart = () => {
  const classes = useStyles();
  const breakPoint_1112px = useMediaQuery('(max-width:1112px)');
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setItems(getCart());
  }, [run]);

  const showItems = (items) => {
    return items.map((product, index) => (
      <ProductCard
        key={index}
        product={product}
        showAddToCart={false}
        cartUpdate={true}
        showRemoveProductButton={true}
        setRun={setRun}
        run={run}
      />
    ));
  };
  const emptyCartMessage = () => (
    <Button
      variant='contained'
      component={Link}
      to='/shop'
      color='secondary'
      className={classes.button}
      startIcon={<ShoppingBasketIcon />}
    >
      Continue shopping
    </Button>
  );
  return (
    <Layout
      title='Shopping Cart'
      description='Manage your cart items. Add remove checkout or continue shopping.'
      className='container-fluid'
    >
      <Grid container xs spacing={3}>
        <Grid item xs>
          {items.length > 0 ? (
            <Fragment>
              <div
                className={
                  breakPoint_1112px
                    ? classes.breakPoint_1112pxRoot
                    : classes.root
                }
                style={{ minWidth: '60vw' }}
              >{`Your cart has ${items.length} items`}</div>
              <hr />
              <Grid container xs spacing={3} style={{ margin: '0 auto' }}>
                {showItems(items)}
              </Grid>
            </Fragment>
          ) : (
            <Fragment>
              <div
                className={
                  breakPoint_1112px
                    ? classes.breakPoint_1112pxRoot
                    : classes.root
                }
                style={{ minWidth: '60vw' }}
              >
                {' Your cart is empty.'}
              </div>
              <hr />
              {emptyCartMessage()}
            </Fragment>
          )}
        </Grid>
        <Grid item xs>
          <div
            className={
              breakPoint_1112px ? classes.breakPoint_1112pxRoot : classes.root
            }
          >
            {'Your Cart Summary'}
          </div>
          <hr />
          <Checkout products={items} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Cart;
