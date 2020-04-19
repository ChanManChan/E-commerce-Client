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
import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';

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
  newPassword: yup
    .string()
    .required('Enter you new password')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
    ),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});

const ResetPassword = ({ match }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: '',
    token: '',
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    if (token) setValues({ ...values, name, token });
  }, []);

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

  const resetPasswordForm = () => (
    <Formik
      validationSchema={schema}
      onSubmit={(data, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        fetch(`${process.env.REACT_APP_API_URL}/reset-password`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newPassword: data.newPassword,
            resetPasswordLink: values.token,
          }),
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
      initialValues={{ newPassword: '', confirmPassword: '' }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field
            name='newPassword'
            type='password'
            label='New Password'
            placeholder='Enter your new password here'
            as={CustomField}
          />
          <Field
            name='confirmPassword'
            type='password'
            label='Confirm New Password'
            placeholder='Re-enter your new password'
            as={CustomField}
          />
          <Button
            disabled={isSubmitting}
            style={{ float: 'right', marginRight: '-.6rem' }}
            type='submit'
            variant='contained'
            color='primary'
            size='large'
          >
            Reset Password
          </Button>
        </Form>
      )}
    </Formik>
  );

  return (
    <Layout
      title='Reset Password'
      description={`Enter your new password ${values.name}`}
      className='container col-md-6'
    >
      <div style={styling()}>{resetPasswordForm()}</div>
    </Layout>
  );
};

export default ResetPassword;
