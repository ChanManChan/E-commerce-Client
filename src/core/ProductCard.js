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
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DefaultImage from '../images/defaultProduct.jpg';
import ShowImage from './ShowImage';
import { API } from '../config';

const useStyles = makeStyles({
  root: {
    width: 375,
  },
  media: {
    height: 300,
    backgroundColor: '#f4f4f4',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  },
});

const ProductCard = ({ product }) => {
  const classes = useStyles();
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
  return (
    <Grid item xs>
      <Card className={classes.root}>
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
        <CardActions>
          <Button
            size='medium'
            color='primary'
            style={{ margin: '1rem', padding: '.4rem' }}
            startIcon={<VisibilityIcon />}
          >
            View Product
          </Button>
          <Button
            size='medium'
            color='secondary'
            style={{ margin: '1rem', padding: '.4rem' }}
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
