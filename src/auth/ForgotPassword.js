import React from 'react';
import { Formik, Form, useField, Field } from 'formik';
import Layout from '../core/Layout';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import {
  TextField,
  Button,
  ThemeProvider,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

const schema = yup.object({
  email: yup.string().email().required('Please Enter you Email'),
});

const ForgotPassword = () => {
  const classes = useStyles();
  const breakPoint_576px = useMediaQuery('(max-width:576px)');

  const CustomField = ({ label, type, placeholder, ...props }) => {
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
          error={!!errorText}
          placeholder={placeholder}
          fullWidth
          label={label}
          variant='outlined'
        />
      </ThemeProvider>
    );
  };

  const styling = () =>
    breakPoint_576px ? { marginRight: '1rem' } : { margin: '0 auto' };

  const forgotPasswordForm = () => (
    <Formik
      validationSchema={schema}
      onSubmit={(data, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        fetch(`${process.env.REACT_APP_API_URL}/forgot-password`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            return response.json();
          })
          .then((result) => {
            if (result.error) {
              toast.error(result.error, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
              setSubmitting(false);
            } else {
              toast.success(result.message, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
              resetForm();
              setSubmitting(false);
            }
          })
          .catch((err) => console.log(err));
      }}
      initialValues={{ email: '' }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field
            name='email'
            type='email'
            label='Email'
            placeholder='Enter your email'
            as={CustomField}
          />
          <Button
            disabled={isSubmitting}
            type='submit'
            style={{ float: 'right', marginRight: '-.6rem' }}
            variant='contained'
            color='primary'
            size='large'
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );

  return (
    <Layout
      title='Forgot Password'
      description='Enter your email for the reset password link'
      className='container col-md-6'
    >
      <div style={styling()}>{forgotPasswordForm()}</div>
    </Layout>
  );
};

export default ForgotPassword;
