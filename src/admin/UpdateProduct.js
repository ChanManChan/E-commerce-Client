import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link, Redirect } from 'react-router-dom';
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
import {
  getProduct,
  deleteProduct,
  getCategories,
  updateProduct,
} from './apiAdmin';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ImageHandler from './ImageHandler';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
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
  iconButtonStyle: {
    marginRight: '.9rem',
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
  photo: yup.mixed().required('Add a product image'),
});

const UpdateProduct = (props) => {
  const classes = useStyles();
  const breakPoint_1055px = useMediaQuery('(max-width:1055px)');
  const { user, token } = isAuthenticated();
  const [values, setValues] = useState({
    buttonText: 'Update',
    categories: [],
    productDetails: {
      name: '',
      description: '',
      price: 0,
      category: '',
      shipping: '',
      quantity: 0,
      formData: '',
      photo: null,
    },
    redirectToProfile: false,
  });
  const {
    buttonText,
    categories,
    productDetails: { formData },
    productDetails,
    redirectToProfile,
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
          photo: null,
          formData: new FormData(),
        },
      });
      resetForm();
    }
  };

  const deleteSingleProduct = () => {
    deleteProduct(props.match.params.productId, user._id, token).then(
      (response) => {
        if (response.error)
          toast.error(`${response.error}`, {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        else {
          setValues({ ...values, redirectToProfile: true });
          toast.success('Product deleted successfully', {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        }
      }
    );
  };
  const redirectUser = () => {
    if (redirectToProfile) return <Redirect to='/' />;
  };
  const updateProductForm = () => (
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
        photo: null,
      }}
      validationSchema={validationSchema}
      onSubmit={(data, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setValues({ ...values, buttonText: 'Updating...' });
        for (let prop in data) formData.set(prop, data[prop]);
        updateProduct(
          props.match.params.productId,
          user._id,
          token,
          formData
        ).then((response) => {
          if (response.error)
            toast.error(`${response.error}`, {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          else {
            handleReset.bind(null, resetForm);
            toast.success('Product updated', {
              position: toast.POSITION.BOTTOM_LEFT,
            });
          }
          setValues({ ...values, buttonText: 'Update' });
        });
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, resetForm, setFieldValue, errors }) => (
        <Grid item xs style={{ maxWidth: '65rem', margin: '0 auto' }}>
          <Form>
            <div style={{ margin: '0 auto 1rem auto' }}>
              <ImageHandler setFieldValue={setFieldValue} maxSize={100000} />
              {errors.photo && errors.photo.length > 0 && (
                <span className='text-danger' style={{ marginLeft: '.6rem' }}>
                  {errors.photo}
                </span>
              )}
            </div>
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
                variant='outlined'
                color='secondary'
                onClick={handleReset.bind(null, resetForm)}
                style={{ marginRight: '.9rem' }}
              >
                Reset form
              </Button>
              <IconButton
                aria-label='delete'
                className={classes.iconButtonStyle}
                onClick={() => {
                  if (window.confirm('Delete this product from Database?'))
                    deleteSingleProduct();
                }}
              >
                <DeleteIcon />
              </IconButton>
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
        {redirectUser()}
        {updateProductForm()}
      </Grid>
    </Layout>
  );
};

export default UpdateProduct;
