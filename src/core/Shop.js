import React, { useState, useEffect, useRef, Fragment } from 'react';
import Layout from './Layout';
import ProductCard from './ProductCard';
import { getCategories, getFilteredProducts } from './apiCore';
import { toast } from 'react-toastify';
import CategoryCheckbox from './CategoryCheckbox';
import PriceRangeRadioBox from './PriceRangeRadioBox';
import { prices } from './fixedPrices';
import { RadioGroup, FormControl, FormGroup, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import GenericList from './GenericList';
import CategoryIcon from '@material-ui/icons/Category';
import CreditCardIcon from '@material-ui/icons/CreditCard';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  rootMedia: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    margin: '0 auto',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  formControl: {
    margin: theme.spacing(3),
  },
  typographyHeading: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: '2rem',
  },
  subheading: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: '1rem',
    marginLeft: '.6rem',
  },
}));
const Shop = () => {
  const classes = useStyles();
  const totalCalls = useRef(0);
  const breakPoint_1147px = useMediaQuery('(max-width:1147px)');
  const breakPoint_524px = useMediaQuery('(max-width:524px)');
  const breakPoint_375px = useMediaQuery('(max-width:375px)');

  const [categories, setCategories] = useState([]);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);
  const [myFilters, setMyFilters] = useState({
    filters: { checkedCategory: [], priceRange: [], priceId: '' },
  });
  const init = () => {
    getCategories().then((data) => {
      if (data.error)
        toast.error(`${data.error}`, { position: toast.POSITION.BOTTOM_LEFT });
      else {
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    if (totalCalls.current < 1) {
      totalCalls.current += 1;
      init();
      return;
    } else
      loadFilteredResults(
        {
          category: myFilters.filters['checkedCategory'],
          price: myFilters.filters['priceRange'],
        },
        myFilters.filters['priceId']
      );
  }, [myFilters]);

  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;
    setMyFilters(newFilters);
  };

  const handlePrice = (value) => {
    const data = prices;
    let array = [];
    for (let key in data)
      if (data[key]._id === parseInt(value)) array = data[key].array;
    return array;
  };

  const loadFilteredResults = (selectedFilters, priceId) => {
    console.log('CHECKING SELECTED FILTERS: ', selectedFilters);
    if (
      selectedFilters.category.length === 0 &&
      selectedFilters.price.length === 0 &&
      parseInt(priceId) !== 0
    ) {
      toast.error('Select at least one filter parameter', {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      setFilteredResults([]);
    } else
      getFilteredProducts(skip, limit, selectedFilters).then((data) => {
        if (data.error)
          toast.error(`${data.error}`, {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        else {
          setFilteredResults(data.data);
          setSize(data.size);
          setSkip(0);
        }
      });
  };

  const loadMore = () => {
    let toSkip = skip + limit;
    getFilteredProducts(toSkip, limit, {
      category: myFilters.filters['checkedCategory'],
      price: myFilters.filters['priceRange'],
    }).then((data) => {
      if (data.error)
        toast.error(`${data.error}`, { position: toast.POSITION.BOTTOM_LEFT });
      else {
        setFilteredResults([...filteredResults, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const dynamicStylingSidebar = () =>
    breakPoint_524px
      ? { minWidth: '100vw', margin: '0 auto', flexDirection: 'column' }
      : breakPoint_1147px
      ? { minWidth: '90vw', margin: '0 auto' }
      : { minWidth: '20vw' };
  const dynamicStylingProducts = () =>
    breakPoint_375px
      ? { minWidth: '100vw', flexDirection: 'column' }
      : breakPoint_1147px
      ? { minWidth: '100vw' }
      : { minWidth: '70vw' };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <Button
          onClick={loadMore}
          size='large'
          variant='outlined'
          color='secondary'
        >
          Load More
        </Button>
      )
    );
  };
  const sidebar = () => (
    <Grid container spacing={3} xs={4} style={dynamicStylingSidebar()}>
      <Grid item xs>
        <GenericList
          subHeader='Filter by categories'
          customClassName={breakPoint_524px ? classes.rootMedia : classes.root}
          customIcon={<CategoryIcon />}
          customIconColor='#3f51b5'
          primaryText='Categories'
          usedComponent='div'
        >
          <div style={{ marginLeft: '1rem' }}>
            <FormControl component='fieldset' className={classes.formControl}>
              <FormGroup>
                <CategoryCheckbox
                  categories={categories}
                  handleFilters={(filters, filterBy) =>
                    handleFilters(filters, filterBy)
                  }
                />
              </FormGroup>
            </FormControl>
          </div>
        </GenericList>
      </Grid>
      <Grid item xs>
        <GenericList
          subHeader='Filter by price range'
          customClassName={breakPoint_524px ? classes.rootMedia : classes.root}
          customIcon={<CreditCardIcon />}
          customIconColor='#3f51b5'
          primaryText='Price Range'
          usedComponent='div'
        >
          <div style={{ marginLeft: '1rem' }}>
            <FormControl component='fieldset'>
              <RadioGroup
                aria-label='priceRange'
                name='customPriceRange'
                value={myFilters.filters['priceId']}
                onChange={(e) => {
                  const newPrice = { ...myFilters };
                  let priceValues = handlePrice(e.target.value);
                  newPrice.filters['priceRange'] = priceValues;
                  newPrice.filters['priceId'] = e.target.value;
                  setMyFilters(newPrice);
                }}
              >
                <PriceRangeRadioBox prices={prices} />
              </RadioGroup>
            </FormControl>
          </div>
        </GenericList>
      </Grid>
    </Grid>
  );
  const products = () => (
    <Fragment>
      <div className={classes.typographyHeading}>{'Products'}</div>
      <Grid container spacing={3} xs={8} style={dynamicStylingProducts()}>
        {filteredResults.length === 0 ? (
          <div className={classes.subheading}>{'Such empty :('}</div>
        ) : (
          filteredResults.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        )}
      </Grid>
      <hr />
      {loadMoreButton()}
    </Fragment>
  );
  return (
    <Layout
      title='Shop Page'
      description='Search and find books of your choice'
      className='container-fluid'
    >
      <div style={{ marginBottom: '20rem' }}>
        <Grid container spacing={3} xs={12}>
          <Grid item xs>
            {sidebar()}
          </Grid>
          <Grid item xs>
            {products()}
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Shop;
