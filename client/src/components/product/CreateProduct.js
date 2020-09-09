import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrencyTypes } from '../../actions/currency';
import { createProducts } from '../../actions/product';
import Spinner from 'react-bootstrap/Spinner';
import CreateProductForm from './CreateProductForm';

const CreateProduct = ({
  createProducts,
  getCurrencyTypes,
  currency: { currencies },
  history,
}) => {
  useEffect(() => {
    getCurrencyTypes();
  }, [getCurrencyTypes]);

  const blankProduct = {
    name: '',
    brand: '',
    amount_in_container: '',
    measurment_type: '',
    currency_type: '',
    cost:''
  };
  const [formsData, setFormsData] = useState([{ ...blankProduct }]);
  const [showForm, setShowForm] = useState(true);
  const [chosenCurrency, setChosenCurrency] = useState();

  const addProduct = () => {
    blankProduct.currency_type = chosenCurrency;
    setFormsData([...formsData, { ...blankProduct }]);
    console.log(formsData);
  };

  const onChange = (e) => {
    const updatedDish = [...formsData];
    updatedDish[e.target.dataset.idx][e.target.name] = e.target.value;
    setFormsData(updatedDish);
    console.log(formsData)
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formsToSend = [...formsData];
    formsToSend.forEach((i) => {
      if (i.cost === '') {
        return (i.cost = 0);
      }
    });
    setFormsData(formsToSend);
    createProducts(formsData, history);
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
  return currencies.length === 0 ? (
    <Spinner animation="border" />
  ) : (
    <CreateProductForm
      currencies={currencies}
      onSubmit={onSubmit}
      chosenCurrency={chosenCurrency}
      formsData={formsData}
      showForm={showForm}
      onChangeForm={onChange}
      addProduct={addProduct}
      addCurrency={addCurrency}
      deleteFormEvent={deleteFormEvent}
    />
  );
};

CreateProduct.propTypes = {
  createProducts: PropTypes.func.isRequired,
  getCurrencyTypes: PropTypes.func.isRequired,
  currency: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currency: state.currency,
});
export default connect(mapStateToProps, {
  createProducts,
  getCurrencyTypes,
})(withRouter(CreateProduct));
