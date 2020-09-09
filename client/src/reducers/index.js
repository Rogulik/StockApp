import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import facility from './facility';
import menu from './menu';
import restaurantMenu from './restaurant-menu';
import dish from './dish';
import currency from './currency';
import dailySellingReport from './selling-report';
import toggleSort from './toggleSort';
import product from './product'
import dailyStockReport from './stock-report'

export default combineReducers({
  alert,
  auth,
  facility,
  menu,
  restaurantMenu,
  dish,
  currency,
  dailySellingReport,
  toggleSort,
  product,
  dailyStockReport
});
