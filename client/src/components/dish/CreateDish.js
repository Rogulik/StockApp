import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrencyTypes } from '../../actions/currency';
import { createDishes } from '../../actions/dish';
import { getUserMenu } from '../../actions/menu';
import Spinner from 'react-bootstrap/Spinner';
import CreateDishForm from './CreateDishForm';

const CreateDish = ({
  createDishes,
  getUserMenu,
  getCurrencyTypes,
  menu: { loading },
  currency: { currencies },
  history,
  match,
}) => {
  useEffect(() => {
    getUserMenu(match.params.id);
  }, [getUserMenu, match.params.id]);
  useEffect(() => {
    getCurrencyTypes();
  }, [getCurrencyTypes]);

  const blankDish = {
    menu_id: match.params.id,
    name: '',
    to_make_cost: '',
    to_sell_price: '',
    portion: '',
    currency_type: '',
  };
  const [formsData, setFormsData] = useState([{ ...blankDish }]);
  const [showForm, setShowForm] = useState(true);
  const [chosenCurrency, setChosenCurrency] = useState();

  const addDish = () => {
    blankDish.currency_type = chosenCurrency;
    setFormsData([...formsData, { ...blankDish }]);
    console.log(formsData);
  };

  const onChange = (e) => {
    const updatedDish = [...formsData];
    updatedDish[e.target.dataset.idx][e.target.name] = e.target.value;
    setFormsData(updatedDish);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formsToSend = [...formsData];
    formsToSend.forEach((i) => {
      if (i.to_make_cost === '') {
        return (i.to_make_cost = 0);
      }
    });
    setFormsData(formsToSend);
    createDishes(match.params.id, formsData, history);
  };
  const addCurrency = (e) => {
    const arrayData = [...formsData];
    arrayData.forEach((i) => (i.currency_type = e.target.value));
    setFormsData(arrayData);
    setChosenCurrency(e.target.value);
    setShowForm(false);
  };
  const deleteFormEvent = (i) => {
    const copyArray = [...formsData];
    copyArray.splice(i, 1);
    setFormsData(copyArray);
  };
  return loading || currencies.length === 0 ? (
    <Spinner animation="border" />
  ) : (
    <CreateDishForm
      currencies={currencies}
      onSubmit={onSubmit}
      chosenCurrency={chosenCurrency}
      formsData={formsData}
      showForm={showForm}
      onChangeForm={onChange}
      addDish={addDish}
      addCurrency={addCurrency}
      deleteFormEvent={deleteFormEvent}
    />
  );
};

CreateDish.propTypes = {
  createDishes: PropTypes.func.isRequired,
  getUserMenu: PropTypes.func.isRequired,
  getCurrencyTypes: PropTypes.func.isRequired,
  menu: PropTypes.object.isRequired,
  currency: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  menu: state.menu,
  currency: state.currency,
});
export default connect(mapStateToProps, {
  createDishes,
  getUserMenu,
  getCurrencyTypes,
})(withRouter(CreateDish));
