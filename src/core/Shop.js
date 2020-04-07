import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import ProductCard from './ProductCard';
import { getCategories } from './apiCore';
import { toast } from 'react-toastify';
import CategoryCheckbox from './CategoryCheckbox';
import PriceRangeRadioBox from './PriceRangeRadioBox';
import { prices } from './fixedPrices';
import { RadioGroup, FormControl } from '@material-ui/core';
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const Shop = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [exposed, setExposed] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };
  const handleInteraction = () => {
    setExposed(!exposed);
  };

  const [categories, setCategories] = useState([]);
  const [myFilters, setMyFilters] = useState({
    filters: { checkedCategory: [], priceRange: [], priceId: '' },
  });
  const init = () => {
    getCategories().then((data) => {
      if (data.error)
        toast.error(`${data.error}`, { position: toast.POSITION.BOTTOM_LEFT });
      else setCategories(data);
    });
  };
  useEffect(() => {
    init();
  }, []);

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

  return (
    <Layout
      title='Shop Page'
      description='Search and find books of your choice'
      className='container-fluid'
    >
      <div style={{ marginBottom: '20rem' }}>
        <div className='row'>
          <div className='col-4'>
            <List
              component='nav'
              aria-labelledby='nested-list-subheader'
              subheader={
                <ListSubheader component='div' id='nested-list-subheader'>
                  Filter by categories
                </ListSubheader>
              }
              className={classes.root}
            >
              <ListItem button onClick={handleClick}>
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary='Categories' />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open} timeout='auto' unmountOnExit>
                <List component='ul' disablePadding>
                  <ListItem button className={classes.nested}>
                    <ul>
                      <CategoryCheckbox
                        categories={categories}
                        handleFilters={(filters, filterBy) =>
                          handleFilters(filters, filterBy)
                        }
                      />
                    </ul>
                  </ListItem>
                </List>
              </Collapse>
            </List>

            {/* <h4>Filter by categories</h4> */}
            {/* <ul>
            <CategoryCheckbox
              categories={categories}
              handleFilters={(filters, filterBy) =>
                handleFilters(filters, filterBy)
              }
            />
          </ul> */}
            {/* <h4>Filter by price range</h4> */}

            <List
              component='nav'
              aria-labelledby='nested-list-subheader'
              subheader={
                <ListSubheader component='div' id='nested-list-subheader'>
                  Filter by price range
                </ListSubheader>
              }
              className={classes.root}
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
                    <div>
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
          </div>
          <div className='col-8'>{JSON.stringify(myFilters, null, 2)}</div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
