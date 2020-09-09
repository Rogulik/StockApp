import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getDishes, deleteDish } from '../../actions/dish';
import { getUserMenu } from '../../actions/menu';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import getSymbolFromCurrency from 'currency-symbol-map';

const ShowDishes = ({
  match,
  getDishes,
  getUserMenu,
  dish,
  menu,
  deleteDish,
}) => {
  useEffect(() => {
    getUserMenu(match.params.id);
  }, [getUserMenu, match.params.id]);
  useEffect(() => {
    getDishes(match.params.id);
  }, [getDishes, match.params.id]);

  return !menu.menu ? (
    <Spinner animation="border" />
  ) : dish.loading ? (
    <Spinner animation="border" />
  ) : dish.dishes.length === 0 ? (
    <Container>
      No available dishes to display. Please create dish here:{'  '}
      <NavLink to={`/create-dish/${match.params.id}`}>Create dish</NavLink>
    </Container>
  ) : !menu.loading ? (
    <Container>
      <h1>{menu.menu.name}</h1>
      <ListGroup>
        {dish.dishes.map((i, index) => {
          return (
            <ListGroup.Item
              key={index}
              variant="light"
              className="d-flex justify-content-between align-items-center "
            >
              <div className="d-flex justify-content-center align-items-center">
                <h5 className="my-0 text-primary mr-5">{i.name}</h5>
                <p className="my-0 text-info">{i.portion}</p>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <p className="my-0 mr-5 font-weight-bold">
                  Production cost: {'  '}
                  {i.to_make_cost}
                </p>
                <p className="my-0 mr-5 font-weight-bold">
                  Selling cost: {'   '}
                  {
                    <NumberFormat
                      value={i.to_sell_price}
                      displayType={'text'}
                      thousandSeparator={true}
                    />
                  }
                </p>
                <p className="my-0 mr-5 font-weight-bold">
                  Currency:{'   '}
                  {getSymbolFromCurrency(i.currency_type)}
                </p>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <Button
                  variant="danger"
                  onClick={(e) => deleteDish(match.params.id, i.id_dish)}
                  className="mr-4"
                >
                  Delete
                </Button>
                <Button href={`/${match.params.id}/update-dish/${i.id_dish}`}>
                  Edit
                </Button>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Container>
  ) : (
    ''
  );
};

ShowDishes.propTypes = {
  getDishes: PropTypes.func.isRequired,
  getUserMenu: PropTypes.func.isRequired,
  deleteDish: PropTypes.func.isRequired,
  dish: PropTypes.object.isRequired,
  menu: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dish: state.dish,
  menu: state.menu,
});

export default connect(mapStateToProps, { getDishes, getUserMenu, deleteDish })(
  withRouter(ShowDishes),
);
