import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProducts } from './apiCore';
import { toast } from 'react-toastify';
import ProductCard from './ProductCard';
import { Grid, makeStyles } from '@material-ui/core';
import Search from './Search';

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
}));

const Home = () => {
  const classes = useStyles();
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const loadProductsBySell = () => {
    getProducts('sold').then((data) => {
      if (data.error)
        toast.error(`${data.error}`, { position: toast.POSITION.BOTTOM_LEFT });
      else setProductsBySell(data);
    });
  };
  const loadProductsByArrival = () => {
    getProducts('createdAt').then((data) => {
      if (data.error)
        toast.error(`${data.error}`, { position: toast.POSITION.BOTTOM_LEFT });
      else setProductsByArrival(data);
    });
  };
  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);
  return (
    <Layout title='Home Page' description='Node React E-commerce App'>
      <div style={{ width: '80%', margin: '0 auto 10rem auto' }}>
        <Search />
        <div className={classes.typographyRoot}>{'New Arrivals'}</div>
        <Grid container spacing={3} xs={12}>
          {productsByArrival.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </Grid>
        <div className={classes.typographyRoot}>{'Best Sellers'}</div>
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
