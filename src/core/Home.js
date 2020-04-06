import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProducts } from './apiCore';
import { toast } from 'react-toastify';
import ProductCard from './ProductCard';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
    <Layout
      title='Home Page'
      description='Node React E-commerce App'
      className='container-fluid'
    >
      <div style={{ width: '80%', margin: '0 auto 10rem auto' }}>
        <h2 className='mb-4'>New Arrivals</h2>
        <Grid container spacing={3} xs={12}>
          {productsByArrival.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </Grid>
        <h2 className='mb-4'>Best Sellers</h2>
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
