import React, { useState, useEffect, Fragment } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik, Form, useField, Field } from 'formik';
import {
  TextField,
  Button,
  ThemeProvider,
  makeStyles,
  createMuiTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { createProduct } from './apiAdmin';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  margin: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
  uploadButton: {
    marginLeft: '.6rem',
  },
  submitButton: {
    marginRight: '-.6rem',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));
const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

const validationSchema = yup.object({
  name: yup.string().required('Product name cannot be null').max(50),
  description: yup
    .string()
    .required('Product description cannot be null')
    .max(2000),
  price: yup
    .number()
    .required('Enter a positive integer')
    .positive()
    .integer()
    .max(1000000),
  quantity: yup.number(),
});

const AddProduct = () => {
  const classes = useStyles();
  const { user, token } = isAuthenticated();
  const [values, setValues] = useState({
    buttonText: 'Submit',
    categories: [],
    photo: '',
    formData: '',
    createdProduct: '',
    redirectToProfile: false,
  });
  const {
    buttonText,
    categories,
    formData,
    createdProduct,
    redirectToProfile,
  } = values;

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
  }, []);

  const CustomSelectField = ({ children, label, onChange }) => {
    return (
      <FormControl variant='outlined' className={classes.formControl}>
        <InputLabel htmlFor='outlined-age-native-simple'>{label}</InputLabel>
        <Select
          native
          label={label}
          onChange={onChange}
          inputProps={{
            name: { label },
            id: 'outlined-age-native-simple',
          }}
        >
          {children}
        </Select>
      </FormControl>
    );
  };

  const CustomImageField = ({ onChange, ...props }) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';
    return (
      <Fragment>
        <input
          {...field}
          accept='image/*'
          className={classes.input}
          id='contained-button-file'
          multiple
          type='file'
          onChange={onChange}
        />
        <label htmlFor='contained-button-file'>
          <Button
            variant='contained'
            color='primary'
            className={classes.uploadButton}
            startIcon={<CloudUploadIcon />}
            component='span'
          >
            Upload Product Image
          </Button>
        </label>
      </Fragment>
    );
  };

  const CustomField = ({
    rows,
    multiline,
    label,
    type,
    placeholder,
    ...props
  }) => {
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
          rows={rows}
          rowsMax={Infinity}
          multiline={multiline}
          label={label}
          variant='outlined'
        />
      </ThemeProvider>
    );
  };
  const setFieldValues = (e) => {
    console.log(e.target.value);
  };

  const newProductForm = () => (
    <Formik
      initialValues={{
        name: '',
        description: '',
        price: '',
        category: '',
        shipping: '',
        quantity: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(data, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setTimeout(() => {
          console.log('DATA FROM PRODUCT FORM: ', data);
          resetForm();
          setSubmitting(false);
        }, 2000);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name='photo' onChange={setFieldValues} as={CustomImageField} />
          <Field
            name='name'
            type='text'
            placeholder='Enter product name'
            label='Product'
            as={CustomField}
          />
          <Field
            name='description'
            type='text'
            multiline={true}
            rows={4}
            placeholder='Provide product description'
            label='Description'
            as={CustomField}
          />
          <Field
            name='price'
            type='number'
            placeholder='Enter the price'
            label='Price'
            as={CustomField}
          />
          <Field
            name='category'
            label='Category'
            type='select'
            onChange={setFieldValues}
            as={CustomSelectField}
          >
            <option aria-label='None' value='' />
            <option value={'5e8715f4ba723a1417ac5143'}>ReactJS</option>
            <option value={'5e86dcaf2f7a8d0deab6eed5'}>NodeJS</option>
            <option value={'5e8715faba723a1417ac5144'}>JavaScript</option>
          </Field>
          <Field
            name='shipping'
            label='Shipping'
            type='select'
            onChange={setFieldValues}
            as={CustomSelectField}
          >
            <option aria-label='None' value='' />
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </Field>
          <Field
            name='quantity'
            type='number'
            placeholder='Enter available stock'
            label='Quantity'
            as={CustomField}
          />
          <Button
            disabled={isSubmitting}
            type='submit'
            variant='contained'
            color='primary'
            size='large'
            className={classes.submitButton}
            style={{ float: 'right' }}
          >
            {buttonText}
          </Button>
        </Form>
      )}
    </Formik>
  );
  return (
    <Layout
      title='Add a new Product'
      description={`G'day ${user.name}, add a new Product?`}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>{newProductForm()}</div>
      </div>
    </Layout>
  );
};

export default AddProduct;
