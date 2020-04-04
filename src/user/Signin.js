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
import { signin, authenticate } from '../auth';
import { Redirect } from 'react-router-dom';

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
          } else {
            authenticate(data, () => {
              toast.success(`Welcome ${data.user.name}`, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
              setValues({ ...values, redirectToReferrer: true });
            });
          }
        });
        setValues({ ...values, buttonText: 'Submit' });
        resetForm();
        setSubmitting(false);
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
    if (redirectToReferrer) return <Redirect to='/' />;
  };
  return (
    <Layout
      title='Signin'
      description='Signin to Node React E-commerce App'
      className='container col-md-6'
    >
      {signInForm()}
      {redirectUser()}
    </Layout>
  );
};

export default Signin;
