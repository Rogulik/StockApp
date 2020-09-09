import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getUserMenus, deleteMenu } from '../../actions/menu';
import MenuCard from './MenuCard';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

import Row from 'react-bootstrap/Row';

const DisplayMenu = ({ getUserMenus, deleteMenu, menu: { menus, loading } }) => {
  useEffect(() => {
    getUserMenus();
  }, [getUserMenus]);
  return loading ? (
    <Spinner />
  ) : (
    <Row>
      {menus.length === 0 ? (
        <div>
          <p>No menus to display yet, please create new one.</p>
          <NavLink to="/create-menu" className="btn btn-primary my-1">
            Create Menu
          </NavLink>
        </div>
      ) : (
        menus.map((i, index) => {
          return (
            <MenuCard
              key={index}
              menuId={i.id_menu}
              menuName={i.name}
              category={i.category}
              deleteMenu={deleteMenu}
              showCheckbox={false}
            />
          );
        })
      )}
    </Row>
  );
};

DisplayMenu.propTypes = {
  menu: PropTypes.object.isRequired,
  getUserMenus: PropTypes.func.isRequired,
  deleteMenu: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  menu: state.menu,
});

export default connect(mapStateToProps, { getUserMenus, deleteMenu })(DisplayMenu);
