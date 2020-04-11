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
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
  breakPoint_1678pxInputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '40ch',
      '&:focus': {
        width: '60ch',
      },
    },
  },
  breakPoint_1423pxInputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
      '&:focus': {
        width: '35ch',
      },
    },
  },
  breakPoint_1156pxInputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
      '&:focus': {
        width: '50ch',
      },
    },
  },
  breakPoint_902pxInputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '40ch',
      '&:focus': {
        width: '60ch',
      },
    },
  },
  button: {
    color: '#fff',
    border: '1px solid #fff',
  },
  breakPoint_902pxButton: {
    color: '#fff',
    border: '1px solid #fff',
    width: '100%',
    marginBottom: '1rem',
  },
  breakPoint_1156pxSearchBar: {
    maxWidth: '100%',
    flexBasis: '100%',
  },
  breakPoint_1156pxRoot: {
    flexDirection: 'column',
  },
  breakPoint_1156pxCategoriesSideBar: {
    maxWidth: '100%',
    flexBasis: '100%',
  },
  breakPoint_902pxSearchBarAndButton: {
    flexDirection: 'column',
    marginTop: '.2rem',
  },
}));

const Search = () => {
  const classes = useStyles();
  const breakPoint_902px = useMediaQuery('(max-width:902px)');
  const breakPoint_1156px = useMediaQuery('(max-width:1156px)');
  const breakPoint_1214px = useMediaQuery('(max-width:1214px)');
  const breakPoint_1423px = useMediaQuery('(max-width:1423px)');
  const breakPoint_1678px = useMediaQuery('(max-width:1678px)');
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
            input: breakPoint_1678px
              ? breakPoint_1423px
                ? breakPoint_1156px
                  ? breakPoint_902px
                    ? classes.breakPoint_902pxInputInput
                    : classes.breakPoint_1156pxInputInput
                  : classes.breakPoint_1423pxInputInput
                : classes.breakPoint_1678pxInputInput
              : classes.inputInput,
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
          <Grid
            container
            spacing={3}
            xs={12}
            className={breakPoint_1156px && classes.breakPoint_1156pxRoot}
          >
            <Grid
              item
              xs={breakPoint_1423px ? 4 : 3}
              className={
                breakPoint_1156px && classes.breakPoint_1156pxCategoriesSideBar
              }
            >
              {/* CATEGORY LIST */}
              <CustomCategoryList
                fetchedCategories={categories}
                formikCategoryArray={values.category}
                reset={reset}
                resetChildMenu={resetChildMenu}
              />
            </Grid>
            <Grid
              item
              xs={breakPoint_1423px ? 8 : 9}
              className={
                breakPoint_1156px && classes.breakPoint_1156pxSearchBar
              }
            >
              <GenericToolbar>
                <Grid
                  container
                  xs
                  spacing={3}
                  className={
                    breakPoint_902px
                      ? classes.breakPoint_902pxSearchBarAndButton
                      : ''
                  }
                >
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
                      className={
                        breakPoint_902px
                          ? classes.breakPoint_902pxButton
                          : classes.button
                      }
                      variant='outlined'
                      size={breakPoint_1214px ? 'medium' : 'large'}
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
