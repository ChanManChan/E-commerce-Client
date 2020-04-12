import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DefaultImage from '../images/defaultProduct.jpg';
import { API } from '../config';
import moment from 'moment';

const useStyles = makeStyles({
  root: {
    width: '24rem',
    margin: '0 auto 2rem auto',
  },
  breakPoint_385pxRoot: {
    maxWidth: '24rem',
    margin: '0 auto 2rem auto',
  },
  media: {
    height: 300,
    backgroundColor: '#f4f4f4',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  },
  expandImage: {
    height: 600,
    backgroundColor: '#f4f4f4',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  },
  button: {
    margin: '.3rem',
    padding: '.4rem',
    width: '100%',
  },
  buttonWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  expandMedia: {
    maxWidth: '50rem',
    margin: '0 auto',
    marginBottom: '2rem',
  },
  expandButton: {
    width: '65%',
    padding: '.6rem',
    margin: '0 auto',
  },
});

const ProductCard = ({ product, expand = false, relatedProduct = false }) => {
  const classes = useStyles();
  const breakPoint_385px = useMediaQuery('(max-width:385px)');
  const [renderActual, setRenderActual] = useState(false);
  useEffect(() => {
    const testImage = (URL) => {
      const imgPromise = new Promise(function imgPromise(resolve, reject) {
        const imgElement = new Image();
        imgElement.addEventListener('load', function imgOnLoad() {
          resolve(this);
        });
        imgElement.addEventListener('error', function imgOnError() {
          reject();
        });
        imgElement.src = URL;
      });
      return imgPromise;
    };
    testImage(`${API}/product/photo/${product._id}`).then(
      function fulfilled(img) {
        setRenderActual(true);
      },
      function rejected() {
        setRenderActual(false);
      }
    );
  }, []);

  const showStock = (quantity) => {
    return quantity > 0 ? (
      <strong className='badge badge-pill badge-success mr-2'>In Stock</strong>
    ) : (
      <strong className='badge badge-pill badge-danger mr-2'>
        Out of Stock
      </strong>
    );
  };

  const fetchImage = () => `${API}/product/photo/${product._id}`;
  const swapMedia = () =>
    expand
      ? classes.expandMedia
      : relatedProduct
      ? classes.root
      : breakPoint_385px
      ? classes.breakPoint_385pxRoot
      : classes.root;
  return (
    <Grid item xs>
      <Card className={swapMedia()}>
        <CardActionArea>
          <CardMedia
            className={
              expand
                ? breakPoint_385px
                  ? classes.media
                  : classes.expandImage
                : classes.media
            }
            image={renderActual || expand ? fetchImage() : DefaultImage}
            title={product.name}
          />
          <CardContent>
            <Typography
              variant={expand ? 'h3' : 'h5'}
              gutterBottom
              style={{ background: '#e5e5e5', borderRadius: '5px' }}
            >
              {product.name}
            </Typography>
            <Typography
              variant='h6'
              gutterBottom
              style={{ background: '#cccccc', borderRadius: '5px' }}
            >
              <strong className='badge badge-pill badge-primary mr-2'>
                Price:{' '}
              </strong>
              &#8377; {product.price}
            </Typography>
            <Typography
              variant='h6'
              gutterBottom
              style={{ background: '#b2b2b2', borderRadius: '5px' }}
            >
              <strong className='badge badge-pill badge-warning mr-2'>
                Category:{' '}
              </strong>{' '}
              {product.category && product.category.name}
            </Typography>
            {expand && (
              <Fragment>
                <Typography
                  variant='h6'
                  gutterBottom
                  style={{ background: '#999999', borderRadius: '5px' }}
                >
                  <strong className='badge badge-pill badge-info mr-2'>
                    Added on:{' '}
                  </strong>{' '}
                  {moment(product.createdAt).fromNow()}
                </Typography>
                <Typography
                  variant='h6'
                  gutterBottom
                  style={{ background: '#7f7f7f', borderRadius: '5px' }}
                >
                  {showStock(product.quantity)}
                </Typography>
              </Fragment>
            )}
            <Typography variant='body2' component='p'>
              {expand
                ? product.description
                : product.description.substring(0, 70) + '....'}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions className={classes.buttonWrapper}>
          {!expand && (
            <Button
              size='medium'
              color='primary'
              variant='outlined'
              component={Link}
              to={`/product/${product._id}`}
              className={classes.button}
              startIcon={<VisibilityIcon />}
            >
              View Product
            </Button>
          )}
          <Button
            size='medium'
            color='secondary'
            variant='outlined'
            className={expand ? classes.expandButton : classes.button}
            startIcon={<AddShoppingCartIcon />}
          >
            Add to cart
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ProductCard;
