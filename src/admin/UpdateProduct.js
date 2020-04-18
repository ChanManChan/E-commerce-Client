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
  Grid,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {
  getProduct,
  deleteProduct,
  getCategories,
  updateProduct,
} from './apiAdmin';
import DefaultProduct from '../images/defaultProduct.jpg';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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
  category: yup.string().required('Please select a category'),
  shipping: yup.number().required('Shipping field cannot be null'),
});

const UpdateProduct = (props) => {
  const classes = useStyles();
  const breakPoint_1055px = useMediaQuery('(max-width:1055px)');
  const { user, token } = isAuthenticated();
  const [values, setValues] = useState({
    buttonText: 'Submit',
    categories: [],
    productDetails: {
      name: '',
      description: '',
      price: 0,
      category: '',
      shipping: '',
      quantity: 0,
      formData: '',
    },
    fileSize: 0,
    errors: {
      photo: '',
    },
    fileUrl: null,
  });
  const {
    buttonText,
    categories,
    formData,
    errors,
    productDetails,
    fileSize,
    fileUrl,
  } = values;

  const init = (productId, callback) => {
    getProduct(productId).then((response) => {
      if (response.error)
        toast.error(`${response.error}`, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      else {
        // populate the state
        productDetails.name = response.name;
        productDetails.description = response.description;
        productDetails.price = response.price;
        productDetails.category = response.category._id;
        productDetails.shipping = response.shipping;
        productDetails.quantity = response.quantity;
        productDetails.formData = new FormData();
        setValues({
          ...values,
          productDetails,
        });
        // load categories
        callback();
      }
    });
  };
  // Load categories and set form data
  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error)
        toast.error(`${data.error}`, { position: toast.POSITION.BOTTOM_LEFT });
      else setValues({ ...values, categories: data });
    });
  };

  useEffect(() => {
    init(props.match.params.productId, initCategories);
  }, []);

  const CustomSelectField = ({ value, children, label, ...props }) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';
    return (
      <FormControl variant='outlined' className={classes.formControl}>
        <InputLabel
          htmlFor='demo-simple-select-outlined-label'
          required
          error={!!errorText}
          style={{ whiteSpace: 'nowrap' }}
        >
          {errorText ? errorText : label}
        </InputLabel>
        <Select
          {...field}
          labelId='demo-simple-select-outlined-label'
          id='demo-simple-select-outlined'
          value={value}
          label={label}
          style={{ width: '16rem' }}
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

  const handleImage = (e) => {
    const fileSize = e.target.files[0].size || 0;
    errors.photo =
      fileSize > 100000 ? 'File size should be less than 100KB' : '';
    setValues({
      ...values,
      // [e.target.name]: e.target.files[0],
      fileUrl: URL.createObjectURL(e.target.files[0]),
      errors,
      fileSize,
    });
    formData.set(e.target.name, e.target.files[0]);
  };

  const handleReset = (resetForm) => {
    if (window.confirm('Reset form?')) {
      setValues({
        ...values,
        productDetails: {
          name: '',
          description: '',
          price: 0,
          category: '',
          shipping: '',
          quantity: 0,
          formData: new FormData(),
        },
      });
      resetForm();
    }
  };

  const newProductForm = () => (
    <Formik
      enableReinitialize={true}
      initialValues={{
        name: values.productDetails.name,
        description: values.productDetails.description,
        price: values.productDetails.price,
        quantity: values.productDetails.quantity,
        category: values.productDetails.category,
        shipping:
          typeof values.productDetails.shipping === 'boolean'
            ? values.productDetails.shipping
              ? 1
              : 0
            : '',
      }}
      validationSchema={validationSchema}
      onSubmit={(data, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        console.log('TESTING CUSTOM SELECT FIELD: ', data);
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, resetForm }) => (
        <Grid item xs style={{ maxWidth: '65rem', margin: '0 auto' }}>
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
            <div
              className='row'
              style={{ flexDirection: breakPoint_1055px ? 'column' : 'row' }}
            >
              <div className='col-md-3'>
                <Field
                  name='category'
                  label='Category'
                  type='select'
                  as={CustomSelectField}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {categories &&
                    categories.map((c, i) => (
                      <MenuItem key={i} value={c._id}>
                        {c.name}
                      </MenuItem>
                    ))}
                </Field>
              </div>
              <div className='col-md-3'>
                <Field
                  name='shipping'
                  label='Shipping'
                  type='select'
                  as={CustomSelectField}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={0}>No</MenuItem>
                  <MenuItem value={1}>Yes</MenuItem>
                </Field>
              </div>
            </div>
            <Field
              name='quantity'
              type='number'
              placeholder='Enter available stock'
              label='Quantity'
              as={CustomField}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginRight: '-.6rem',
              }}
            >
              <Button
                variant='outlined'
                color='secondary'
                onClick={handleReset.bind(null, resetForm)}
                style={{ marginRight: '.9rem' }}
              >
                Reset form
              </Button>
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
      title='Add a new Product'
      description={`G'day ${user.name}, add a new Product?`}
      className='container-fluid'
    >
      <Grid
        container
        spacing={3}
        justify='center'
        style={{ marginBottom: '7rem', padding: '.5rem' }}
      >
        {newProductForm()}
      </Grid>
    </Layout>
  );
};

export default UpdateProduct;
