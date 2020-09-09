import React, { useState, useEffect } from 'react';
import UpdateProductForm from './UpdateProductForm'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getProduct, updateProduct } from '../../actions/product';
import { getCurrencyTypes } from '../../actions/currency';
import Spinner from 'react-bootstrap/Spinner';

const UpdateProduct = ({
  product,
  currency,
  updateProduct,
  getProduct,
  getCurrencyTypes,
  match,
  history,
}) => {
  const [productToUpdate, setProductToUpdate] = useState({
    name: '',
    brand: '',
    amount_in_container: '',
    measurment_type: '',
    currency_type: '',
    cost: ''
  });

  useEffect(() => {
    getProduct(match.params.id_product, history);
    setProductToUpdate({
      name: product.loading ? '' : product.product.name,
      cost: product.loading || 0.0 ? '' : product.product.cost,
      amount_in_container: product.loading ? '' : product.product.amount_in_container,
      brand: product.loading ? '' : product.product.brand,
      currency_type: product.loading ? '' : product.product.currency_type,
      measurment_type: product.loading ? '' : product.product.measurment_type,
    });
  }, [product.loading]);
  useEffect(() => {
    getCurrencyTypes();
  }, [getCurrencyTypes]);

  const onChangeForm = (e) => {
    setProductToUpdate({ ...productToUpdate, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const { cost } = productToUpdate;
    if (cost === '') {
      setProductToUpdate({ ...productToUpdate, cost: 0 });
    }

    updateProduct(
      match.params.id_product,
      productToUpdate,
      history,
    );
  };
  return product.loading || currency.loading ? (
    <Spinner animation="border" />
  ) : (
    <UpdateProductForm 
      onSubmit={onSubmit}
      productToUpdate={productToUpdate}
      onChangeForm={onChangeForm}
      currency={currency}
    />
    
  );
};

UpdateProduct.propTypes = {
  product: PropTypes.object.isRequired,
  currency: PropTypes.object.isRequired,
  getProduct: PropTypes.func.isRequired,
  getCurrencyTypes: PropTypes.func.isRequired,
  updateProduct: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  product: state.product,
  currency: state.currency,
});

export default connect(mapStateToProps, {
  updateProduct,
  getProduct,
  getCurrencyTypes,
})(withRouter(UpdateProduct));
