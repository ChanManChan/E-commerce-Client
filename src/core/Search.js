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
import { Formik, Form, useField } from 'formik';

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
    reset: false,
  });
  const { categories, category, search, results, searched, reset } = data;
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

  const CustomSearchBar = ({ placeholder, ...props }) => {
    const [field] = useField(props);
    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          {...field}
          placeholder={placeholder}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
    );
  };
  const GenericToolbar = ({ children }) => (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>{children}</Toolbar>
      </AppBar>
    </div>
  );
  const resetChildMenu = () => {
    setData({ ...data, reset: !data.reset });
  };
  const searchForm = () => (
    <Formik
      initialValues={{ category: [], searchbar: '' }}
      onSubmit={(data, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        console.log('DATA FROM SUBMIT: ', data);
        resetChildMenu();
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <Grid container spacing={3} xs={12}>
            <Grid item xs={3}>
              {/* CATEGORY LIST */}
              <CustomCategoryList
                fetchedCategories={categories}
                formikCategoryArray={values.category}
                reset={reset}
                resetChildMenu={resetChildMenu}
              />
            </Grid>
            <Grid item xs={9}>
              <GenericToolbar>
                <Grid container xs spacing={3}>
                  {/* SEARCH BAR */}
                  <Grid item xs>
                    <CustomSearchBar
                      placeholder={'Search products...'}
                      name='searchbar'
                      value={values.searchbar}
                    />
                  </Grid>
                  {/* SEARCH BUTTON */}
                  <Grid item xs>
                    <Button
                      className={classes.button}
                      variant='outlined'
                      size='large'
                      disabled={isSubmitting}
                      type='submit'
                      color='secondary'
                      style={{ float: 'right' }}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </GenericToolbar>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );

  return searchForm();
};

export default Search;
