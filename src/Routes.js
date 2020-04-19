import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Home from './core/Home';
import Shop from './core/Shop';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import Dashboard from './user/UserDashboard';
import AdminDashboard from './user/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import UpdateProduct from './admin/UpdateProduct';
import Product from './core/Product';
import Cart from './core/Cart';
import Orders from './admin/Orders';
import Profile from './user/Profile';
import ManageProducts from './admin/ManageProducts';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/auth/password/forgot' component={ForgotPassword} />
        <Route
          exact
          path='/auth/password/reset/:token'
          component={ResetPassword}
        />
        <Route exact path='/product/:productId' component={Product} />
        <Route exact path='/signin' component={Signin} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/shop' component={Shop} />
        <Route exact path='/cart' component={Cart} />
        <PrivateRoute exact path='/user/dashboard' component={Dashboard} />
        <PrivateRoute exact path='/profile/:userId' component={Profile} />
        <AdminRoute exact path='/admin/dashboard' component={AdminDashboard} />
        <AdminRoute exact path='/create/category' component={AddCategory} />
        <AdminRoute
          exact
          path='/admin/product/update/:productId'
          component={UpdateProduct}
        />
        <AdminRoute exact path='/create/product' component={AddProduct} />
        <AdminRoute exact path='/admin/orders' component={Orders} />
        <AdminRoute exact path='/admin/products' component={ManageProducts} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
