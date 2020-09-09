import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { getDishesByRestaurant } from '../../../actions/dish';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Dish = ({
    dish,
    menu,
    match,
    formsData,
    setFormsData,
    getDishesByRestaurant,
  }) => {
    const onChange = (e) => {
      const updatedReport = [...formsData];
      updatedReport[e.target.dataset.idx][e.target.name] = e.target.value;
      setFormsData(updatedReport);
    };
    useEffect(() => {
      getDishesByRestaurant(match.params.id_facility);
    }, []);
  
    useEffect(() => {
      setFormsData(
        dish.dishes.map((i, idx) => ({
          dish_id: i.id_dish,
          to_sell_price: Number(i.to_sell_price),
          report_date: '',
          sold_amount: 0,
          earned_money: 0,
        })),
      );
    }, [dish.loading]);
    const incrementAmount = 
      (id) => {
        const updatedReport = [...formsData];
        updatedReport.map((i, idx) => ({
          ...i,
          sold_amount: i.dish_id === id ? i.sold_amount++ : i.sold_amount,
        }));
        setFormsData(updatedReport);
      }
  
    const decrementAmount = 
      (id) => {
        const updatedReport = [...formsData];
        updatedReport.map((i, idx) => ({
          ...i,
          sold_amount:
            i.dish_id === id && i.sold_amount > 0
              ? (i.sold_amount -= 1)
              : i.sold_amount
        }));
        setFormsData(updatedReport);
      };
  
    return dish.loading || formsData.length === 0 ? (
      <Spinner animation="border" />
    ) : dish.dishes.length === 0 ? (
      <Container>
        There is no dishes related to that restaurant. Please make sure to add new
        dishes to the menu and connect the menu before creating the report.
      </Container>
    ) : (
      <ListGroup>
        {dish.dishes.map((dishItem, idx) => {
          
          return dishItem.menu_connection === menu.menu ? (
            <ListGroup.Item
              key={idx}
              className="d-flex justify-content-between align-items-center "
            >
              <div className="d-flex justify-content-center align-items-center">
                <h5 className="my-0 text-success mr-5">{dishItem.name}</h5>
                <p className="my-0 text-info">{dishItem.portion}</p>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <Button
                  onClick={() => decrementAmount(dishItem.id_dish)}
                  className="rounded-circle"
                  disabled={formsData[idx].sold_amount <= 0 ? true : false}
                >
                  <i className="fas fa-minus-circle"></i>
                </Button>
                <Form.Group className="mx-2">
                  <Form.Label className="text-muted my-0">
                    Sold Amount:
                  </Form.Label>
                  <Form.Control
                    className="text-center"
                    type="number"
                    name="sold_amount"
                    data-idx={idx}
                    value={formsData[idx].sold_amount}
                    onChange={(e) => onChange(e)}
                    min={0}
                    max={9999.99}
                    required
                  />
                </Form.Group>
                <Button
                  className="rounded-circle"
                  data-idx={idx}
                  onClick={() => incrementAmount(dishItem.id_dish)}
                >
                  <i className="fas fa-plus-circle"></i>
                </Button>
              </div>
            </ListGroup.Item>
          ) : (
            ''
          );
        })}
      </ListGroup>
    );
  };

  Dish.propTypes = {
      dish: PropTypes.object.isRequired,
      getDishesByRestaurant: PropTypes.func.isRequired,
      menu:PropTypes.func.isRequired,
      formsData:PropTypes.array.isRequired,
      setFormsData:PropTypes.func.isRequired,
  }
  
  const ConnectedDish = connect(
    (state) => ({
      dish: state.dish,
    }),
    { getDishesByRestaurant },
  )(withRouter(Dish));

  export default ConnectedDish