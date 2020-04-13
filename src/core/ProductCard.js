import React, { useState, Fragment, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
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
  withStyles,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import VisibilityIcon from '@material-ui/icons/Visibility';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import DefaultImage from '../images/defaultProduct.jpg';
import Slider from '@material-ui/core/Slider';
import { API } from '../config';
import moment from 'moment';
import { addItem, updateItem, removeItem } from './cartHelpers';

const CustomSlider = withStyles({
  root: {
    color: '#52af77',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const useStyles = makeStyles((theme) => ({
  root: {
    width: '24rem',
    margin: '0 auto 2rem auto',
  },
  breakPoint_425pxRoot: {
    maxWidth: '24rem',
    margin: '0 auto 2rem auto',
  },
  sliderRoot: {
    width: 300 + theme.spacing(3) * 2,
  },
  breakPoint_425pxSliderRoot: {
    width: 150 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
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
}));

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

const ProductCard = ({
  product,
  expand = false,
  relatedProduct = false,
  showAddToCart = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = (f) => f,
  run = undefined,
}) => {
  const classes = useStyles();
  const breakPoint_425px = useMediaQuery('(max-width:425px)');

  const [renderActual, setRenderActual] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  useEffect(() => {
    testImage(`${API}/product/photo/${product._id}`).then(
      function fulfilled(img) {
        setRenderActual(true);
      },
      function rejected() {
        setRenderActual(false);
      }
    );
  });
  const showStock = (quantity) => {
    return quantity > 0 ? (
      <strong className='badge badge-pill badge-success mr-2'>In Stock</strong>
    ) : (
      <strong className='badge badge-pill badge-danger mr-2'>
        Out of Stock
      </strong>
    );
  };

  const handleChange = (productId, e, v) => {
    setRun(!run);
    setCount(v < 1 ? 1 : v);
    if (v >= 1) updateItem(productId, v);
  };

  const showCartUpdateOptions = (cartUpdate) =>
    cartUpdate && (
      <div
        className={
          breakPoint_425px
            ? classes.breakPoint_425pxSliderRoot
            : classes.sliderRoot
        }
      >
        <div className={classes.margin} />
        <Typography gutterBottom>Adjust Quantity</Typography>
        <CustomSlider
          valueLabelDisplay='auto'
          aria-label='pretto slider'
          name='quantity'
          onChange={(e, v) => handleChange(product._id, e, v)}
          value={count}
        />
      </div>
    );

  const addToCart = () => {
    addItem(product, () => {
      setRedirect(true);
    });
  };

  const removeProductButton = (showRemoveProductButton) =>
    showRemoveProductButton && (
      <Button
        size='medium'
        color='secondary'
        variant='outlined'
        onClick={() => {
          removeItem(product._id);
          setRun(!run);
        }}
        className={classes.button}
        startIcon={<RemoveShoppingCartIcon />}
      >
        Remove Product
      </Button>
    );

  const shouldRedirect = (redirect) => {
    if (redirect) return <Redirect to='/cart' />;
  };
  const viewProductsButton = (expand) =>
    !expand && (
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
    );
  const addToCartButton = (showAddToCart) =>
    showAddToCart && (
      <Button
        size='medium'
        color='secondary'
        onClick={addToCart}
        variant='outlined'
        className={expand ? classes.expandButton : classes.button}
        startIcon={<AddShoppingCartIcon />}
      >
        Add to cart
      </Button>
    );

  const showProductQuantity = (expand) =>
    expand && (
      <Typography
        variant='h6'
        gutterBottom
        style={{ background: '#7f7f7f', borderRadius: '5px' }}
      >
        {showStock(product.quantity)}
      </Typography>
    );

  const showProductCreatedAt = (expand) =>
    expand && (
      <Typography
        variant='h6'
        gutterBottom
        style={{ background: '#999999', borderRadius: '5px' }}
      >
        <strong className='badge badge-pill badge-info mr-2'>Added on: </strong>{' '}
        {moment(product.createdAt).fromNow()}
      </Typography>
    );

  const showProductCategoryName = () => (
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
  );
  const showProductPrice = () => (
    <Typography
      variant='h6'
      gutterBottom
      style={{ background: '#cccccc', borderRadius: '5px' }}
    >
      <strong className='badge badge-pill badge-primary mr-2'>Price: </strong>
      &#8377; {product.price}
    </Typography>
  );
  const showProductName = () => (
    <Typography
      variant={expand ? 'h3' : 'h5'}
      gutterBottom
      style={{ background: '#e5e5e5', borderRadius: '5px' }}
    >
      {product.name}
    </Typography>
  );

  const showProductDescription = () => (
    <Typography variant='body2' component='p'>
      {expand
        ? product.description
        : product.description.substring(0, 70) + '....'}
    </Typography>
  );

  const fetchImage = () => `${API}/product/photo/${product._id}`;

  const showProductImage = () => (
    <CardMedia
      className={
        expand
          ? breakPoint_425px
            ? classes.media
            : classes.expandImage
          : classes.media
      }
      image={renderActual ? fetchImage() : DefaultImage}
      title={product.name}
    />
  );
  const swapMedia = () =>
    expand
      ? classes.expandMedia
      : relatedProduct
      ? classes.root
      : breakPoint_425px
      ? classes.breakPoint_425pxRoot
      : classes.root;
  return (
    <Grid item xs>
      {shouldRedirect(redirect)}
      <Card className={swapMedia()}>
        <CardActionArea>
          {showProductImage()}
          <CardContent>
            {showProductName()}
            {showProductPrice()}
            {showProductCategoryName()}
            {showProductCreatedAt(expand)}
            {showProductQuantity(expand)}
            {showProductDescription()}
          </CardContent>
        </CardActionArea>
        <CardActions className={classes.buttonWrapper}>
          {viewProductsButton(expand)}
          {removeProductButton(showRemoveProductButton)}
          {showCartUpdateOptions(cartUpdate)}
          {addToCartButton(showAddToCart)}
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ProductCard;
