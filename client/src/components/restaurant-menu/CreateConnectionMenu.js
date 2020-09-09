import React, { useEffect, useState } from 'react';
import MenuCard from '../../components/menu/MenuCard';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUserFacility } from '../../actions/facility';
import { getUserMenus } from '../../actions/menu';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {
  createConnection,
  getRestaurantMenuConnections,
} from '../../actions/restaurant-menu';

const CreateConnectionMenu = ({
  getUserFacility,
  getUserMenus,
  getRestaurantMenuConnections,
  createConnection,
  facility: { facility },
  menu: { menus, loading },
  restaurantMenu,
  match,
  history,
}) => {
  useEffect(() => {
    getUserFacility(match.params.id);
  }, [getUserFacility, match.params.id]);
  useEffect(() => {
    getRestaurantMenuConnections(match.params.id);
  }, [getRestaurantMenuConnections, match.params.id]);
  useEffect(() => {
    getUserMenus();
  }, [getUserMenus]);
  const [menusId, setMenusId] = useState([]);
  const handleChange = (event) => {
    const { value } = event.target;
    //parse the value to integer
    const intValue = parseInt(value, 10);
    //saving menus id in new array
    let newMenusId = [...menusId];
    //check if the id already exists in the array
    const menuIdExists = newMenusId.find((menu) => menu === intValue);
    //if its exists erase from the array on unchecked the checkbox
    if (menuIdExists) {
      newMenusId = newMenusId.filter((menu) => menu !== intValue);
    } else {
      const menu = menus.find((menu) => menu.id_menu === intValue);
      newMenusId = [...newMenusId, menu.id_menu];
    }
    //saving the finall id in our local state
    setMenusId(newMenusId);
    // console.log(menusId);
  };
  const availableMenusArray = menus.filter((menu) => {
    const restaurantMenuIds = restaurantMenu.menus.map((m) => m.menu);
    return !restaurantMenuIds.includes(menu.id_menu);
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    createConnection(match.params.id, menusId, history);
  };
  return loading || facility === null || restaurantMenu.loading ? (
    <Spinner />
  ) : availableMenusArray.length === 0 ? (
    <>
      <h1>{facility.name}</h1>
      <hr />
      No available menus for this restaurant to connect. Go back to{' '}
      <NavLink to="/dashboard">Dashboard</NavLink>.
    </>
  ) : (
    <>
      <h1>{facility.name}</h1>
      <p>
        Please choose which menu would you like to add by checking the checkbox
        on the choosen menu
      </p>
      <hr />
      <Form
        className="d-flex justify-content-around"
        onSubmit={(e) => onSubmit(e)}
      >
        {availableMenusArray.map((menu, index) => {
          return (
            <MenuCard
              handleChange={handleChange}
              menuId={menu.id_menu}
              menuName={menu.name}
              category={menu.category}
              showCheckbox={true}
              showActions={false}
            />
          );
        })}
        <Button type="submit">Submit</Button>
      </Form>
    </>
  );
};

CreateConnectionMenu.propTypes = {
  facility: PropTypes.object.isRequired,
  menu: PropTypes.object.isRequired,
  restaurantMenu: PropTypes.object.isRequired,
  getUserFacility: PropTypes.func.isRequired,
  getUserMenus: PropTypes.func.isRequired,
  getRestaurantMenuConnections: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  facility: state.facility,
  menu: state.menu,
  restaurantMenu: state.restaurantMenu,
});

export default connect(mapStateToProps, {
  getUserFacility,
  getUserMenus,
  getRestaurantMenuConnections,
  createConnection,
})(CreateConnectionMenu);
