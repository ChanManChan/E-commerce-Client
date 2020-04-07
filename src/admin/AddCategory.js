import React, { useState } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik, Form, useField } from 'formik';
import {
  TextField,
  Button,
  ThemeProvider,
  makeStyles,
  createMuiTheme,
  Grid,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { createCategory } from './apiAdmin';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    marginRight: '.9rem',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#f57f17',
    },
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});
const validationSchema = yup.object({
  name: yup.string().required('Category name cannot be null'),
});
const AddCategory = () => {
  const [buttonText, setButtonText] = useState('Submit');
  const classes = useStyles();

  const CustomField = ({ maxWidth, label, type, placeholder, ...props }) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';
    return (
      <ThemeProvider theme={theme}>
        <TextField
          {...field}
          className={classes.margin}
          id='mui-theme-provider-outlined-input'
          type={type}
          helperText={errorText}
          placeholder={placeholder}
          error={!!errorText}
          fullWidth
          label={label}
          variant='outlined'
        />
      </ThemeProvider>
    );
  };
  // Destructure user and token from localStorage
  const { user, token } = isAuthenticated();

  const newCategoryForm = () => (
    <Formik
      initialValues={{ name: '' }}
      validationSchema={validationSchema}
      onSubmit={(data, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setButtonText('Submitting...');
        createCategory(user._id, token, { name: data.name }).then((data) => {
          if (data.error) {
            setButtonText('Submit');
            setSubmitting(false);
            toast.error(`${data.error}`, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          } else {
            setButtonText('Submit');
            toast.success('Category added', {
              position: toast.POSITION.BOTTOM_LEFT,
            });
            resetForm();
            setSubmitting(false);
          }
        });
      }}
    >
      {({ isSubmitting }) => (
        <Grid item xs style={{ maxWidth: '65rem' }}>
          <Form style={{ margin: '0 auto' }}>
            <CustomField
              name='name'
              type='text'
              placeholder='Category Name'
              label='Category'
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginRight: '-.6rem',
              }}
            >
              <Button
                disabled={isSubmitting}
                variant='contained'
                color='secondary'
                className={classes.button}
                size='large'
                component={Link}
                to='/admin/dashboard'
              >
                Back to Dashboard
              </Button>
              <Button
                disabled={isSubmitting}
                type='submit'
                variant='contained'
                color='primary'
                size='large'
              >
                {buttonText}
              </Button>
            </div>
          </Form>
        </Grid>
      )}
    </Formik>
  );
  return (
    <Layout
      title='Add a new Category'
      description={`G'day ${user.name}, add a new category?`}
      className='container-fluid'
    >
      <Grid container spacing={3} justify='center' style={{ padding: '.5rem' }}>
        {newCategoryForm()}
      </Grid>
    </Layout>
  );
};

export default AddCategory;
