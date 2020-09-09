import React, { useState, useEffect } from 'react';
import UpdateDishForm from './UpdateDishForm'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getDish, updateDish } from '../../actions/dish';
import { getCurrencyTypes } from '../../actions/currency';
import Spinner from 'react-bootstrap/Spinner';

const UpdateDish = ({
  dish,
  currency,
  updateDish,
  getDish,
  getCurrencyTypes,
  match,
  history,
}) => {
  const [dishToUpdate, setDishToUpdate] = useState({
    name: '',
    to_make_cost: '',
    to_sell_price: '',
    portion: '',
    currency_type: '',
  });

  useEffect(() => {
    getDish(match.params.menu_id, match.params.dish_id, history);
    setDishToUpdate({
      name: dish.loading ? '' : dish.dish.name,
      to_make_cost: dish.loading || 0.0 ? '' : dish.dish.to_make_cost,
      to_sell_price: dish.loading ? '' : dish.dish.to_sell_price,
      portion: dish.loading ? '' : dish.dish.portion,
      currency_type: dish.loading ? '' : dish.dish.currency_type,
    });
  }, [dish.loading]);
  useEffect(() => {
    getCurrencyTypes();
  }, [getCurrencyTypes]);

  const onChangeForm = (e) => {
    setDishToUpdate({ ...dishToUpdate, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const { to_make_cost } = dishToUpdate;
    if (to_make_cost === '') {
      setDishToUpdate({ ...dishToUpdate, to_make_cost: 0 });
    }

    updateDish(
      match.params.menu_id,
      match.params.dish_id,
      dishToUpdate,
      history,
    );
  };
  return dish.loading || currency.loading ? (
    <Spinner animation="border" />
  ) : (
    <UpdateDishForm 
      onSubmit={onSubmit}
      dishToUpdate={dishToUpdate}
      onChangeForm={onChangeForm}
      currency={currency}
    />
    
  );
};

UpdateDish.propTypes = {
  dish: PropTypes.object.isRequired,
  currency: PropTypes.object.isRequired,
  getDish: PropTypes.func.isRequired,
  getCurrencyTypes: PropTypes.func.isRequired,
  updateDish: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  dish: state.dish,
  currency: state.currency,
});

export default connect(mapStateToProps, {
  updateDish,
  getDish,
  getCurrencyTypes,
})(withRouter(UpdateDish));
