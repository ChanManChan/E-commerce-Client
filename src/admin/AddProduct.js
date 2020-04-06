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
import DefaultProduct from '../images/defaultProduct.jpg';

const validateForm = (errors, unknownInput) => {
  let valid = true;
  Object.values(errors).forEach(
    // if we have an error string set valid to false
    (val) => val.length > 0 && (valid = false)
  );
  const { category, shipping, fileSize } = unknownInput;
  if (category.length === 0 || shipping.length === 0 || fileSize > 100000)
    valid = false;
  return valid;
};

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
    category: '',
    shipping: '',
    fileSize: 0,
    errors: {
      photo: '',
      category: '',
      shipping: '',
    },
    redirectToProfile: false,
    fileUrl: null,
  });
  const {
    buttonText,
    categories,
    formData,
    category,
    shipping,
    errors,
    fileSize,
    createdProduct,
    fileUrl,
    redirectToProfile,
  } = values;

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
  }, []);

  const CustomSelectField = ({ value, name, children, label, onChange }) => {
    return (
      <FormControl variant='outlined' className={classes.formControl}>
        <InputLabel id='demo-simple-select-outlined-label'>{label}</InputLabel>
        <Select
          labelId='demo-simple-select-outlined-label'
          id='demo-simple-select-outlined'
          name={name}
          value={value}
          onChange={onChange}
          label={label}
        >
          {children}
        </Select>
      </FormControl>
    );
  };

  const CustomImageField = ({ onChange, ...props }) => {
    const [field] = useField(props);
    return (
      <Fragment>
        <input
          {...field}
          accept='image/*'
          name='photo'
          className={classes.input}
          id='contained-button-file'
          type='file'
          onChange={onChange}
        />
        <img
          src={fileUrl ? fileUrl : DefaultProduct}
          style={{
            width: '10rem',
            height: '10rem',
            padding: '.2rem',
            marginLeft: '.6rem',
            marginBottom: '.5rem',
            border: '1px solid #444',
            objectFit: 'cover',
            objectPosition: '50% 50%',
          }}
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
    const { name, value } = e.target;
    switch (name) {
      case 'category':
        errors.category = value === '' ? 'Category cannot be null' : '';
        break;
      case 'shipping':
        errors.shipping = value === '' ? 'Shipping cannot be null' : '';
        break;
      default:
        break;
    }
    setValues({
      ...values,
      [name]: value,
      errors,
    });
    formData.set(name, value);
  };
  const handleImage = (e) => {
    const fileSize = e.target.files[0].size || 0;
    errors.photo =
      fileSize > 100000 ? 'File size should be less than 100KB' : '';
    setValues({
      ...values,
      [e.target.name]: e.target.files[0],
      fileUrl: URL.createObjectURL(e.target.files[0]),
      errors,
      fileSize,
    });
    formData.set(e.target.name, e.target.files[0]);
  };
  const newProductForm = () => (
    <Formik
      initialValues={{
        name: '',
        description: '',
        price: '',
        quantity: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(data, { setSubmitting, resetForm }) => {
        const unknownInput = { category, shipping, fileSize };
        setSubmitting(true);
        setValues({ ...values, buttonText: 'Submitting...' });
        if (validateForm(errors, unknownInput)) {
          // console.log('DATA FROM ONSUBMIT: ', data);
          Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
          });
          // for (var value of formData.values()) {
          //   console.log('VALUE FROM ITERATOR: ', value);
          // }
          createProduct(user._id, token, formData).then((data) => {
            if (data.err) {
              setValues({ ...values, buttonText: 'Submit' });
              toast.error(`${data.err}`, {
                position: toast.POSITION.BOTTOM_LEFT,
              });
            } else {
              toast.success('Product created', {
                position: toast.POSITION.BOTTOM_LEFT,
              });
              setValues({
                ...values,
                buttonText: 'Submit',
                category: '',
                shipping: '',
                fileSize: 0,
                fileUrl: null,
                createdProduct: data.name,
              });
              resetForm();
              setSubmitting(false);
            }
          });
        } else {
          toast.error('Invalid Form', {
            position: toast.POSITION.BOTTOM_LEFT,
          });
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name='photo' onChange={handleImage} as={CustomImageField} />
          {errors.photo.length > 0 && (
            <Fragment>
              <br />
              <span style={{ marginLeft: '0.6rem' }} className='text-danger'>
                {errors.photo}
              </span>
            </Fragment>
          )}
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
          <div className='row'>
            <div className='col-md-2'>
              <Field
                name='category'
                label='Category'
                type='select'
                value={category}
                onChange={setFieldValues}
                as={CustomSelectField}
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={'5e8715f4ba723a1417ac5143'}>ReactJS</MenuItem>
                <MenuItem value={'5e86dcaf2f7a8d0deab6eed5'}>NodeJS</MenuItem>
                <MenuItem value={'5e8715faba723a1417ac5144'}>
                  JavaScript
                </MenuItem>
              </Field>
              {errors.category.length > 0 && (
                <Fragment>
                  <br />
                  <span
                    style={{ marginLeft: '0.6rem' }}
                    className='text-danger'
                  >
                    {errors.category}
                  </span>
                </Fragment>
              )}
            </div>
            <div className='col-md-2'>
              <Field
                name='shipping'
                label='Shipping'
                type='select'
                value={shipping}
                onChange={setFieldValues}
                as={CustomSelectField}
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={0}>No</MenuItem>
                <MenuItem value={1}>Yes</MenuItem>
              </Field>
              {errors.shipping.length > 0 && (
                <Fragment>
                  <br />
                  <span
                    style={{ marginLeft: '0.6rem' }}
                    className='text-danger'
                  >
                    {errors.shipping}
                  </span>
                </Fragment>
              )}
            </div>
          </div>

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
