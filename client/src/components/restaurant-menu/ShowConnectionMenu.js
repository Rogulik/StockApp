import React, { useEffect } from 'react';
import MenuCard from '../../components/menu/MenuCard';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUserFacility } from '../../actions/facility';
import Spinner from 'react-bootstrap/Spinner';
import {
  getRestaurantMenuConnections,
  deleteRestaurantMenuConnections,
} from '../../actions/restaurant-menu';

const ShowConnectionMenu = ({
  getUserFacility,
  getRestaurantMenuConnections,
  deleteRestaurantMenuConnections,
  facility: { facility },
  restaurantMenu: { menus, loading },
  match,
}) => {
  useEffect(() => {
    getUserFacility(match.params.id);
  }, [getUserFacility, match.params.id]);
  useEffect(() => {
    getRestaurantMenuConnections(match.params.id);
  }, [getRestaurantMenuConnections, match.params.id]);
  return loading || facility === null ? (
    <Spinner />
  ) : menus.length === 0 ? (
    <>
      <h1>{facility.name}</h1>
      <hr />
      There is no connected Menus for this restaurant. Please create new
      connection by clicking on this link {'  '}
      <NavLink to={`/connect-menu/${facility.id_facility}`}>
        Connect Menu
      </NavLink>
      .
    </>
  ) : (
    <>
      <h1>{facility.name}</h1>
      <p>You have {menus.length} connected Menus to this restaurant.</p>
      <hr />
      {menus.map((menu, index) => {
        return (
          <MenuCard
            menuId={menu.menu}
            menuName={menu.name}
            category={menu.category}
            restaurantId={match.params.id}
            deleteRestaurantMenuConnections={deleteRestaurantMenuConnections}
            showCheckbox={false}
            showActions={false}
            showConnectionActions={true}
          />
        );
      })}
    </>
  );
};

ShowConnectionMenu.propTypes = {
  facility: PropTypes.object.isRequired,
  restaurantMenu: PropTypes.object.isRequired,
  getUserFacility: PropTypes.func.isRequired,
  getRestaurantMenuConnections: PropTypes.func.isRequired,
  deleteRestaurantMenuConnections: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  facility: state.facility,
  restaurantMenu: state.restaurantMenu,
});

export default connect(mapStateToProps, {
  getUserFacility,
  getRestaurantMenuConnections,
  deleteRestaurantMenuConnections,
})(ShowConnectionMenu);
