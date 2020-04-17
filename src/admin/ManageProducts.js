import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { Grid } from '@material-ui/core';
import { getProducts } from './apiAdmin';
import { toast } from 'react-toastify';
import CustomTable from './CustomTable';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  const loadProducts = () => {
    getProducts('sold').then((response) => {
      if (response.error)
        toast.error(`${response.error}`, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      else setProducts(response);
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Layout
      title='Manage Products'
      description='Perform CRUD on products'
      className='container-fuild'
    >
      <Grid container xs={10} style={{ margin: '0 auto' }}>
        {products && <CustomTable products={products} />}
      </Grid>
    </Layout>
  );
};

export default ManageProducts;
