import React, { useState, useEffect } from 'react';
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

const useStyles = makeStyles({
  root: {
    width: '24rem',
    margin: '0 auto 2rem auto',
  },
  mediaRoot: {
    maxWidth: '24rem',
    margin: '0 auto 2rem auto',
  },
  media: {
    height: 300,
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
});

const ProductCard = ({ product }) => {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:385px)');
  const [renderActual, setRenderActual] = useState(true);
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
        console.log('THAT IMAGE IS FOUND AND LOADED', img);
        setRenderActual(true);
      },
      function rejected() {
        console.log('THAT IMAGE WAS NOT FOUND');
        setRenderActual(false);
      }
    );
  }, []);

  const fetchImage = () => `${API}/product/photo/${product._id}`;
  const swapMedia = () => (matches ? classes.mediaRoot : classes.root);
  return (
    <Grid item xs>
      <Card className={swapMedia()}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={renderActual ? fetchImage() : DefaultImage}
            title={product.name}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='h2'>
              {product.name}
            </Typography>
            <Typography variant='h6'>&#8377; {product.price}</Typography>
            <Typography variant='body2' color='textSecondary' component='p'>
              {product.description.substring(0, 70) + '....'}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions className={classes.buttonWrapper}>
          <Button
            size='medium'
            color='primary'
            variant='outlined'
            className={classes.button}
            startIcon={<VisibilityIcon />}
          >
            View Product
          </Button>
          <Button
            size='medium'
            color='secondary'
            variant='outlined'
            className={classes.button}
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
