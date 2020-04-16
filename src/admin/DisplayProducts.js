import React from 'react';
import GenericList from '../core/GenericList';
import ListAltIcon from '@material-ui/icons/ListAlt';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  productList: {
    width: '19rem',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  productsSubList: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
}));
const DisplayProducts = ({ orderedProducts }) => {
  const classes = useStyles();
  return (
    <GenericList
      customClassName={classes.productList}
      customIcon={<ListAltIcon />}
      customIconColor='#f44336'
      primaryText='View products'
      usedComponent='ul'
    >
      <List className={classes.productsSubList} subheader={<li />}>
        {orderedProducts.map((singleProduct, i) => (
          <li key={`section-${i}`} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader
                style={{ color: '#009688', backgroundColor: '#f4f4f4' }}
              >
                {singleProduct.name}
              </ListSubheader>
              {Object.keys(
                (({ name, __v, ...rest }) => rest)(singleProduct)
              ).map((key, index) =>
                key === 'createdAt' || key === 'updatedAt' ? (
                  <ListItem key={index}>
                    <ListItemText
                      primary={key}
                      secondary={moment(
                        (({ name, __v, ...rest }) => rest)(singleProduct)[key]
                      ).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                    />
                  </ListItem>
                ) : key === 'price' ? (
                  <ListItem key={index}>
                    <ListItemText
                      primary={key}
                      secondary={
                        '\u20B9 ' +
                        (({ name, __v, ...rest }) => rest)(singleProduct)[key]
                      }
                    />
                  </ListItem>
                ) : (
                  <ListItem key={index}>
                    <ListItemText
                      primary={key}
                      secondary={
                        (({ name, __v, ...rest }) => rest)(singleProduct)[key]
                      }
                    />
                  </ListItem>
                )
              )}
            </ul>
          </li>
        ))}
      </List>
    </GenericList>
  );
};

export default DisplayProducts;
