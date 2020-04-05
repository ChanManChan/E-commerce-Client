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
import { signup } from '../auth';

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
const Signup = () => {
  const [buttonText, setButtonText] = useState('Submit');
  const classes = useStyles();

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

  const validationSchema = yup.object({
    name: yup.string().required('Please Enter your Name').max(15),
    email: yup.string().required('Please Enter your Email').email(),
    password: yup
      .string()
      .required('Please Enter you password')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
      ),
    confirmPassword: yup
      .string()
      .required()
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  });

  const signUpForm = () => (
    <Formik
      initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
      // validate={(values) => {
      //   const errors = {};
      //   if (values.name.includes('Nandu')) errors.name = 'No Nandu';
      //   return errors;
      // }}
      validationSchema={validationSchema}
      onSubmit={(data, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setButtonText('Submitting...');
        const { name, email, password } = data;
        signup({ name, email, password }).then((data) => {
          if (data.error) {
            toast.error(`${data.error}`, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
            setButtonText('Submit');
            setSubmitting(false);
          } else {
            toast.success('Signup success, signin to continue.', {
              position: toast.POSITION.BOTTOM_LEFT,
            });
            setButtonText('Submit');
            resetForm();
            setSubmitting(false);
          }
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <CustomField
            name='name'
            type='text'
            placeholder='Name'
            label='Name'
          />
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
          <CustomField
            name='confirmPassword'
            type='password'
            placeholder='Re-Type Password'
            label='Confirm-Password'
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
          {/* <pre>{JSON.stringify(values, null, 2)}</pre>
          <pre>{JSON.stringify(errors, null, 2)}</pre> */}
        </Form>
      )}
    </Formik>
  );

  return (
    <Layout
      title='Signup'
      description='Signup to Node React E-commerce App'
      className='container col-md-6'
    >
      {signUpForm()}
    </Layout>
  );
};

export default Signup;
