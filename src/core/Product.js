import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { read, listRelated } from './apiCore';
import { toast } from 'react-toastify';
import ProductCard from './ProductCard';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  typographyRoot: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: '2rem',
    margin: '-1rem 0 1rem 0',
  },
}));

const Product = (props) => {
  const classes = useStyles();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  const loadSingleProduct = (productId) => {
    read(productId).then((data) => {
      if (data.error)
        toast.error(`${data.error}`, { position: toast.POSITION.BOTTOM_LEFT });
      else {
        setProduct(data);
        // fetch related products
        listRelated(data._id).then((data) => {
          if (data.error)
            toast.error(`${data.error}`, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          else setRelatedProducts(data);
        });
      }
    });
  };
  useEffect(() => {
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, [props]);
  return (
    <Layout
      title={product && product.name}
      description={
        product &&
        product.description &&
        product.description.substring(0, 200) + '...'
      }
    >
      <Grid container xs spacing={3}>
        <Grid item xs>
          <div
            className={classes.typographyRoot}
            style={{ minWidth: '37.5rem' }}
          >
            {'Current Product'}
          </div>
          {product && <ProductCard product={product} expand={true} />}
        </Grid>
        <Grid item xs>
          <div className={classes.typographyRoot}>{'Related Products'}</div>
          <Grid container xs>
            {relatedProducts.map((p, i) => (
              <ProductCard key={i} product={p} relatedProduct={true} />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Product;
