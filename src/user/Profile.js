import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { read, update, updateLocalStorage } from './apiUser';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, useField, Form, Field } from 'formik';
import * as yup from 'yup';
import {
  Button,
  TextField,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontSize: '2rem',
  },
  margin: {
    margin: theme.spacing(1.5),
  },
  button: {
    marginRight: '-.6rem',
  },
  resetButton: {
    marginRight: '.6rem',
  },
}));
const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

const Profile = (props) => {
  const classes = useStyles();
  const breakPoint_576px = useMediaQuery('(max-width:576px)');

  const [{ name, email, password, buttonText, success }, setValues] = useState({
    name: '',
    email: '',
    password: '',
    buttonText: 'Update',
    success: false,
  });
  const { token } = isAuthenticated();

  const init = (userId) => {
    read(userId, token).then((response) => {
      if (response.error)
        toast.error(`${response.error}`, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      else
        setValues((currentState) => ({
          ...currentState,
          name: response.name,
          email: response.email,
        }));
    });
  };
  const CustomInputField = ({ type, placeholder, label, ...props }) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';
    return (
      <ThemeProvider theme={theme}>
        <TextField
          {...field}
          label={label}
          placeholder={placeholder}
          type={type}
          className={classes.margin}
          helperText={errorText}
          error={!!errorText}
          fullWidth
          variant='outlined'
        />
      </ThemeProvider>
    );
  };

  const validationSchema = yup.object({
    name: yup.string().required('Please Enter your Name').max(50),
    email: yup.string().required('Please Enter you Email').email(),
    password: yup
      .string()
      .required('Please Enter your password')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
      ),
  });

  const handleReset = (resetForm) => {
    if (window.confirm('Reset form?')) {
      resetForm();
    }
  };
  const profileUpdateForm = (
    userName = '',
    userEmail = '',
    userPassword = '',
    success = false
  ) =>
    (userName || userEmail || userPassword || success) && (
      <Formik
        initialValues={{
          name: userName,
          email: userEmail,
          password: userPassword,
        }}
        validationSchema={validationSchema}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          setValues((currentState) => ({
            ...currentState,
            buttonText: 'Updating...',
          }));
          console.log('DATA FROM UPDATE PROFILE: ', data);
          setValues({
            buttonText: 'Update',
            success: true,
            name: '',
            email: '',
            password: '',
          });
          setSubmitting(false);
        }}
      >
        {({ values, isSubmitting, resetForm }) => (
          <Form>
            <Field
              name='name'
              placeholder='Enter you name'
              label='Name'
              type='text'
              value={values.name || ''}
              as={CustomInputField}
            />
            <Field
              name='email'
              type='email'
              placeholder='Enter you email'
              label='Email'
              value={values.email || ''}
              as={CustomInputField}
            />
            <Field
              name='password'
              type='password'
              placeholder='Enter you password'
              label='password'
              value={values.password || ''}
              as={CustomInputField}
            />
            <div style={{ float: 'right' }}>
              <Button
                disabled={isSubmitting}
                type='button'
                variant='outlined'
                size='large'
                color='secondary'
                onClick={handleReset.bind(null, resetForm)}
                className={classes.resetButton}
              >
                Reset form
              </Button>
              <Button
                disabled={isSubmitting}
                type='submit'
                variant='contained'
                color='primary'
                className={classes.button}
                size='large'
              >
                {buttonText}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    );

  useEffect(() => {
    init(props.match.params.userId);
  }, []);

  const styling = () =>
    breakPoint_576px ? { marginRight: '1rem' } : { margin: '0 auto' };

  return (
    <Layout
      title='User Profile'
      description='General Settings'
      className='container col-md-6'
    >
      <div style={styling()}>
        <div className={classes.root}>{'Account Info'}</div>
        {profileUpdateForm(name, email, password, success)}
      </div>
    </Layout>
  );
};

export default Profile;
