import React, { useState, useEffect, useRef, Fragment } from 'react';
import Layout from './Layout';
import ProductCard from './ProductCard';
import { getCategories, getFilteredProducts } from './apiCore';
import { toast } from 'react-toastify';
import CategoryCheckbox from './CategoryCheckbox';
import PriceRangeRadioBox from './PriceRangeRadioBox';
import { prices } from './fixedPrices';
import { RadioGroup, FormControl, FormGroup, Grid } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CategoryIcon from '@material-ui/icons/Category';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
}));
const Shop = () => {
  const classes = useStyles();
  const totalCalls = useRef(0);
  const breakPoint_1147px = useMediaQuery('(max-width:1147px)');
  const breakPoint_524px = useMediaQuery('(max-width:524px)');
  const breakPoint_375px = useMediaQuery('(max-width:375px)');

  const [open, setOpen] = useState(true);
  const [exposed, setExposed] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };
  const handleInteraction = () => {
    setExposed(!exposed);
  };

  const [categories, setCategories] = useState([]);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
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
      console.log('ENTERED THE USE_EFFECT:', totalCalls.current);
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
        else setFilteredResults(data.data);
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

  // minWidth: '100vw', flexDirection: 'column'
  const sidebar = () => (
    <Grid container spacing={3} xs={4} style={dynamicStylingSidebar()}>
      <Grid item xs>
        <List
          component='nav'
          aria-labelledby='nested-list-subheader'
          subheader={
            <ListSubheader component='div' id='nested-list-subheader'>
              Filter by categories
            </ListSubheader>
          }
          className={breakPoint_524px ? classes.rootMedia : classes.root}
        >
          <ListItem button onClick={handleClick}>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary='Categories' />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              <ListItem button className={classes.nested}>
                <div style={{ marginLeft: '1rem' }}>
                  <FormControl
                    component='fieldset'
                    className={classes.formControl}
                  >
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
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Grid>
      <Grid item xs>
        <List
          component='nav'
          aria-labelledby='nested-list-subheader'
          subheader={
            <ListSubheader component='div' id='nested-list-subheader'>
              Filter by price range
            </ListSubheader>
          }
          className={breakPoint_524px ? classes.rootMedia : classes.root}
        >
          <ListItem button onClick={handleInteraction}>
            <ListItemIcon>
              <CreditCardIcon />
            </ListItemIcon>
            <ListItemText primary='Price Range' />
            {exposed ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={exposed} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              <ListItem button className={classes.nested}>
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
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Grid>
    </Grid>
  );
  const products = () => (
    <Fragment>
      <div className={classes.typographyHeading}>{'Products'}</div>
      <Grid container spacing={3} xs={8} style={dynamicStylingProducts()}>
        {filteredResults.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </Grid>
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
