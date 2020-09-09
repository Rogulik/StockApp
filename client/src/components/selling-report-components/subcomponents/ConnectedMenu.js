import React, {useState,useEffect} from 'react'
import PropTypes from 'prop-types'
import ConnectedDish from './ConnectedDish'
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getRestaurantMenuConnections } from '../../../actions/restaurant-menu';
import { createSellingReport } from '../../../actions/sellingReport';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Menu = ({
    restaurantMenu,
    match,
    history,
    getRestaurantMenuConnections,
    createSellingReport,
  }) => {
    useEffect(() => {
      getRestaurantMenuConnections(match.params.id_facility);
    }, [getRestaurantMenuConnections, match.params.id_facility]);
  
    const [formsData, setFormsData] = useState([]);
    const [chosenDate, setChosenDate] = useState('');
  
    //adding date to each dish from the report
    const addDate = (e) => {
      const arrayData = [...formsData];
      arrayData.forEach((i) => (i.report_date = e.target.value));
      setFormsData(arrayData);
      setChosenDate(e.target.value);
    };
    const onSubmit = (e) => {
      e.preventDefault();
      const updatedReport = [...formsData];
      updatedReport.map((i, idx) => ({
        ...i,
        earned_money: (i.earned_money = i.sold_amount * i.to_sell_price),
      }));
      createSellingReport(match.params.id_facility, formsData, history);
    };
    return restaurantMenu.loading ? (
      <Spinner animation="border" />
    ) : restaurantMenu.menus.length === 0 ? (
      <Container>
        There is no menus connected to that restaurant yet. Please make sure to
        create a menus and add them to Your restaurant.
      </Container>
    ) : (
      <Container>
        <Form className="mt-5" onSubmit={(e) => onSubmit(e)}>
          <Form.Group>
            <Form.Label className="text-muted">Choose the date first:</Form.Label>
            <Form.Control
              type="date"
              value={chosenDate}
              onChange={(e) => addDate(e)}
              max={moment().format('YYYY-MM-DD')}
              required
            />
          </Form.Group>
          {restaurantMenu.menus.map((menu) => (
            <div
              key={menu.menu}
              className="shadow p-3 mb-5 bg-white rounded position-relative"
            >
              <h4>{menu.name}</h4>
              <p className="text-muted">{menu.category}</p>
  
              <ConnectedDish
                menu={menu}
                formsData={formsData}
                setFormsData={setFormsData}
              />
            </div>
          ))}
  
          <Button variant="info" type="submit">
            Create Report
          </Button>
        </Form>
      </Container>
    );
  };

  Menu.propTypes = {
      restaurantMenu: PropTypes.object.isRequired,
      getRestaurantMenuConnections: PropTypes.func.isRequired,
      createSellingReport: PropTypes.func.isRequired,
  }
  
  const ConnectedMenu = connect(
    (state) => ({
      restaurantMenu: state.restaurantMenu,
    }),
    {
      getRestaurantMenuConnections,
      createSellingReport,
    },
  )(withRouter(Menu));

  export default ConnectedMenu