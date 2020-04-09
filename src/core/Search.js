import React, { useEffect, useState } from 'react';
import { getCategories } from './apiCore';
import { toast } from 'react-toastify';
import SearchIcon from '@material-ui/icons/Search';
import { fade, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CustomCategoryList from './CustomCategoryList';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '60ch',
      '&:focus': {
        width: '80ch',
      },
    },
  },

  button: {
    color: '#fff',
    border: '1px solid #fff',
  },
}));

const Search = () => {
  const classes = useStyles();
  const [data, setData] = useState({
    categories: [],
    category: '',
    search: '',
    results: [],
    searched: false,
  });
  const { categories, category, search, results, searched } = data;
  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error)
        toast.error(`${data.error}`, { position: toast.POSITION.BOTTOM_LEFT });
      else setData({ ...data, categories: data });
    });
  };
  useEffect(() => {
    loadCategories();
  }, []);

  const searchSubmit = (e) => {
    e.preventDefault();
    console.log('SUBMITTED DATA: ', e.target.value);
  };
  const handleChange = (e) => {
    //
    console.log('CHECKBOX: ', e.target.name, e.target.value);
  };

  const CustomSearchBar = ({ onChange, placeholder, name }) => (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
      />
    </div>
  );
  const searchForm = () => (
    <Formik
      initialValues={{ category: '', searchbar: '' }}
      onSubmit={(data, { setSubmitting, resetForm }) => {
        console.log('DATA FROM SUBMIT: ', data);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Grid container spacing={3} xs={12}>
            <Grid item xs={3}>
              {/* CATEGORY LIST */}
              <Field
                name='category'
                array={categories}
                onChange={handleChange}
                as={CustomCategoryList}
              />
            </Grid>
            <Grid item xs={9}>
              <div className={classes.root}>
                <AppBar position='static'>
                  <Toolbar>
                    <Grid container xs spacing={3}>
                      {/* SEARCH BAR */}
                      <Grid item xs>
                        <Field
                          name='searchbar'
                          onChange={handleChange}
                          placeholder='Search...'
                          as={CustomSearchBar}
                        />
                      </Grid>
                      {/* SEARCH BUTTON */}
                      <Grid item xs>
                        <Button
                          className={classes.button}
                          variant='outlined'
                          size='large'
                          type='submit'
                          color='secondary'
                          style={{ float: 'right' }}
                        >
                          Search
                        </Button>
                      </Grid>
                    </Grid>
                  </Toolbar>
                </AppBar>
              </div>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );

  return searchForm();
};

export default Search;
