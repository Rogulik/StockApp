import React, { Fragment, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/layout/Layout';
import './App.scss';
import NavigationBar from './components/layout/NavigationBar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//componenets
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Landing from './components/layout/Landing';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PriveteRoute';
import DisplayMenu from './components/menu/DisplayMenu';
import EditAccount from './components/auth/EditAccount';
import CreateConnectionMenu from './components/restaurant-menu/CreateConnectionMenu';
import ShowConnectionMenu from './components/restaurant-menu/ShowConnectionMenu';
import CreateDish from './components/dish/CreateDish';
import CreateFacility from './components/facility/CreateFacility';
import CreateMenu from './components/menu/CreateMenu';
import ShowDishes from './components/dish/ShowDishes';
import UpdateDish from './components/dish/UpdateDish';
import CreateDailyReport from './components/selling-report-components/CreateDailyReport';
import ShowDailyReport from './components/selling-report-components/ShowDailyReport';
import CreateProduct from './components/product/CreateProduct'
import DisplayProduct from './components/product/DisplayProduct'
import UpdateProduct from './components/product/UpdateProduct'
import CreateStockReport from './components/stock-report/CreateStockReport'
import ShowStockReport from './components/stock-report/ShowStockReport'
//Redux
import { Provider } from 'react-redux';
import setAuthToken from './utils/setAuthToken';
import store from './store';
import { loadUser } from './actions/auth';

const App = () => {
  useEffect(() => {
    setAuthToken(localStorage.token);
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Fragment>
        <Router>
          <NavigationBar />
          <Alert />
          <Layout>
            <Route exact path="/" component={Landing} />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/create-facility"
                component={CreateFacility}
              />
              <PrivateRoute exact path="/menu" component={DisplayMenu} />
              <PrivateRoute exact path="/create-menu" component={CreateMenu} />
              <PrivateRoute
                exact
                path="/edit-account"
                component={EditAccount}
              />
              <PrivateRoute
                exact
                path="/connect-menu/:id"
                component={CreateConnectionMenu}
              />
              <PrivateRoute
                exact
                path="/connected-menu/:id"
                component={ShowConnectionMenu}
              />
              <PrivateRoute
                exact
                path="/create-dish/:id"
                component={CreateDish}
              />
              <PrivateRoute
                exact
                path="/show-dish/:id"
                component={ShowDishes}
              />
              <PrivateRoute
                exact
                path="/:menu_id/update-dish/:dish_id"
                component={UpdateDish}
              />
              <PrivateRoute
                exact
                path="/create-daily-report/:id_facility"
                component={CreateDailyReport}
              />
              <PrivateRoute
                exact
                path="/show-daily-report/:id_facility"
                component={ShowDailyReport}
              />
              <PrivateRoute
                exact
                path="/create-product"
                component={CreateProduct}
              />
              <PrivateRoute
                exact
                path="/display-product"
                component={DisplayProduct}
              />
              <PrivateRoute
                exact
                path="/update-product/:id_product"
                component={UpdateProduct}
              />
              <PrivateRoute
                exact
                path="/create-stock-report/:id_facility"
                component={CreateStockReport}
              />
              <PrivateRoute
                exact
                path="/show-stock-report/:id_facility"
                component={ShowStockReport}
              />
            </Switch>
          </Layout>
        </Router>
      </Fragment>
    </Provider>
  );
};

export default App;
