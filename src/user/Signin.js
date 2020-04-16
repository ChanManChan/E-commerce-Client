import React, { useState } from 'react';
import Layout from '../core/Layout';
import { Formik, Form, useField } from 'formik';
import {
  TextField,
  Button,
  ThemeProvider,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { signin, authenticate, isAuthenticated } from '../auth';
import { Redirect } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});
const validationSchema = yup.object({
  email: yup.string().required('Please Enter your Email').email(),
  password: yup
    .string()
    .required('Please Enter you password')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
    ),
});

const Signin = () => {
  const [values, setValues] = useState({
    buttonText: 'Submit',
    redirectToReferrer: false,
  });
  const breakPoint_576px = useMediaQuery('(max-width:576px)');
  const { user } = isAuthenticated();
  const classes = useStyles();
  const { buttonText, redirectToReferrer } = values;
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
          placeholder={placeholder}
          error={!!errorText}
          fullWidth
          label={label}
          variant='outlined'
        />
      </ThemeProvider>
    );
  };

  const signInForm = () => (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={(data, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setValues({ ...values, buttonText: 'Submitting...' });
        const { email, password } = data;
        signin({ email, password }).then((data) => {
          if (data.error) {
            toast.error(`${data.error}`, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
            setValues({ ...values, buttonText: 'Submit' });
            setSubmitting(false);
          } else {
            authenticate(data, () => {
              toast.success(`Welcome ${data.user.name}`, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
              setValues({
                ...values,
                redirectToReferrer: true,
                buttonText: 'Submit',
              });
              resetForm();
              setSubmitting(false);
            });
          }
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <CustomField
            name='email'
            type='email'
            placeholder='Email'
            label='Email'
          />
          <CustomField
            name='password'
            type='password'
            placeholder='Password'
            label='Password'
          />
          <Button
            disabled={isSubmitting}
            type='submit'
            variant='contained'
            color='primary'
            size='large'
            style={{ float: 'right' }}
          >
            {buttonText}
          </Button>
        </Form>
      )}
    </Formik>
  );
  const redirectUser = () => {
    if (redirectToReferrer) {
      if (user && user.role === 1) return <Redirect to='/admin/dashboard' />;
      else return <Redirect to='/user/dashboard' />;
    }
    if (isAuthenticated()) return <Redirect to='/' />;
  };

  const styling = () =>
    breakPoint_576px ? { marginRight: '1rem' } : { margin: '0 auto' };

  return (
    <Layout
      title='Signin'
      description='Signin to Node React E-commerce App'
      className='container col-md-6'
    >
      {redirectUser()}
      <div style={styling()}>{signInForm()}</div>
    </Layout>
  );
};

export default Signin;
