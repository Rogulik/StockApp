import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../actions/product';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import getSymbolFromCurrency from 'currency-symbol-map';

const ShowDishes = ({
  match,
  getProducts,
  product,
  deleteProduct,
}) => {
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return product.loading ? (
    <Spinner animation="border" />
  ) : product.products.length === 0 ? (
    <Container>
      No available products to display. Please create new products here:{'  '}
      <NavLink to={`/create-product`}>Create product</NavLink>
    </Container>
  ) : (
    <Container>
      <h1>Products list:</h1>
      <ListGroup>
      <ListGroup.Item
              
              className="d-flex justify-content-between align-items-center "
            >
              <div className="d-flex justify-content-center align-items-center">
                <h5 className="my-0 mr-2">Name /</h5>
                <p className="my-0 font-weight-bold">Brand /</p>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <p className="my-0 font-weight-bold">
                  Amount as whole:
                </p>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <p className="my-0 font-weight-bold">
                  Cost:
                </p>
              </div>
              <div className="d-flex justify-content-center mr-5 align-items-center">
                <p className=' my-0 font-weight-bold'>Manage product:</p>
              </div>
            </ListGroup.Item>
        {product.products.map((i, index) => {
          return (
            <ListGroup.Item
              key={index}
              variant="light"
              className="d-flex justify-content-between align-items-center "
            >
              <div className="d-flex justify-content-center align-items-center">
                <h5 className="my-0 text-primary mr-2">{i.name}</h5>
                <p className="my-0 text-info">{i.brand}</p>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <p className="my-0 mr-1 font-weight-bold">
                  <NumberFormat
                      value={i.amount_in_container}
                      displayType={'text'}
                      thousandSeparator={true}
                    />
                </p>
                <p className="my-0 mr-1 font-weight-bold">
                    {i.measurment_type}
                </p> 
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <p className="my-0 mr-1 font-weight-bold">
                  <NumberFormat
                      value={i.cost}
                      displayType={'text'}
                      thousandSeparator={true}
                    />
                </p>
                <p className="my-0 font-weight-bold">
                  {getSymbolFromCurrency(i.currency_type)}
                </p>
              </div>
              <div className="d-flex justify-content-center align-items-center mr-4">
                <Button
                  variant="danger"
                  onClick={(e) => deleteProduct(i.id_product)}
                  className="mr-2"
                >
                  Delete
                </Button>
                <Button href={`/update-product/${i.id_product}`}>
                  Edit
                </Button>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Container>
  )
};

ShowDishes.propTypes = {
  getProducts: PropTypes.func.isRequired,
  deleteProduct: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  product: state.product,
});

export default connect(mapStateToProps, { getProducts, deleteProduct })(
  withRouter(ShowDishes),
);
