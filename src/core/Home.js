import React, { useState, useEffect, Fragment } from 'react';
import Layout from './Layout';
import { getProducts } from './apiCore';
import { toast } from 'react-toastify';
import ProductCard from './ProductCard';
import { Grid, makeStyles, Button } from '@material-ui/core';
import Search from './Search';
import Icon from '@material-ui/core/Icon';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  typographyRoot: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: '2rem',
    margin: '1rem 0 1rem 0',
  },
  breakPoint_700pxTypographyRoot: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: '1rem',
    margin: '.6rem 0 .6rem 0',
  },
  button: {
    margin: theme.spacing(3),
  },
  breakPoint_700pxButton: {
    margin: theme.spacing(1),
    padding: '.5rem',
  },
}));

const Home = () => {
  const classes = useStyles();
  const breakPoint_700px = useMediaQuery('(max-width:700px)');
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [productsBySearch, setProductsBySearch] = useState([]);

  const loadProductsBySell = () => {
    getProducts('sold').then((data) => {
      if (data.error)
        toast.error(`${data.error}`, { position: toast.POSITION.BOTTOM_LEFT });
      else setProductsBySell(data);
    });
  };
  const loadProductsByArrival = () => {
    getProducts('createdAt')
      .then((data) => {
        if (data.error)
          toast.error(`${data.error}`, {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        else setProductsByArrival(data);
      })
      .catch((err) => console.log('ERROR FROM ARRIVAL: ', err));
  };
  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, [productsBySearch]);
  const setSearchedProducts = (customArray) => {
    setProductsBySearch(customArray);
  };
  const dynamicStyling = () =>
    breakPoint_700px
      ? {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }
      : { display: 'flex', justifyContent: 'space-between' };
  return (
    <Layout title='Home Page' description='Node React E-commerce App'>
      <div style={{ width: '80%', margin: '0 auto 10rem auto' }}>
        <Search
          setResults={(customArray) => setSearchedProducts(customArray)}
        />
        {productsBySearch && productsBySearch.length !== 0 && (
          <Fragment>
            <hr />
            <div style={dynamicStyling()}>
              <div
                className={
                  breakPoint_700px
                    ? classes.breakPoint_700pxTypographyRoot
                    : classes.typographyRoot
                }
              >
                {'Searched Products'}
              </div>
              <Button
                variant='outlined'
                color='primary'
                size='small'
                onClick={() => {
                  setProductsBySearch([]);
                  toast.success('Queried items cleared', {
                    position: toast.POSITION.BOTTOM_LEFT,
                  });
                }}
                className={
                  breakPoint_700px
                    ? classes.breakPoint_700pxButton
                    : classes.button
                }
                endIcon={<Icon>backspace</Icon>}
              >
                Clear Queried
              </Button>
            </div>
            <hr />
            <Grid container spacing={3} xs={12}>
              {productsBySearch.map((product, i) => (
                <ProductCard key={i} product={product} />
              ))}
            </Grid>
          </Fragment>
        )}
        <hr />
        <div
          className={
            breakPoint_700px
              ? classes.breakPoint_700pxTypographyRoot
              : classes.typographyRoot
          }
        >
          {'New Arrivals'}
        </div>
        <hr />
        <Grid container spacing={3} xs={12}>
          {productsByArrival.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </Grid>
        <hr />
        <div
          className={
            breakPoint_700px
              ? classes.breakPoint_700pxTypographyRoot
              : classes.typographyRoot
          }
        >
          {'Best Sellers'}
        </div>
        <hr />
        <Grid container spacing={3} xs={12}>
          {productsBySell.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </Grid>
      </div>
    </Layout>
  );
};

export default Home;
