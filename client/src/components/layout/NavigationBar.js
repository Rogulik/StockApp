import React from 'react';
import { useLocation, NavLink } from 'react-router-dom'
import { Nav, Navbar, DropdownButton, Image } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout, deleteAccount } from '../../actions/auth';

const NavigationBar = ({
  auth: { isAuthenticated, loading, user },
  logout,
  deleteAccount,
}) => {

  
  const authLinks = (
    <>
      <NavLink to="/dashboard">Stock App</NavLink>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="d-flex align-items-center ml-auto">
          <DropdownButton className="mr-3" title="Create">
            <NavLink
              to="/create-facility"
              className="nav-link"
              activeClassName="active"
            >
              <i className="fas fa-store-alt"></i>
              {'  '}
              Facility
            </NavLink>
            <NavLink
              to="/create-menu"
              className="nav-link"
              activeClassName="active"
            >
              <i className="fas fa-book-open"></i>
              {'  '}
              Menu
            </NavLink>
            <NavLink
              to="/create-product"
              className="nav-link"
              activeClassName="active"
            >
              <i className="fas fa-box"></i>
              {'  '}
              Product
            </NavLink>
          </DropdownButton>
          <DropdownButton className="mr-3" title="Show">
            <NavLink
              to="/dashboard"
              className="nav-link"
              activeClassName="active"
            >
              <i className="fas fa-list"></i>
              {'  '}
              Dashboard
            </NavLink>
            <NavLink to="/menu" className="nav-link" activeClassName="active">
            <i className="fas fa-book-open"></i>
              {'  '}
              Menus List
            </NavLink>
            <NavLink to="/display-product" className="nav-link" activeClassName="active">
              <i className="fas fa-box"></i>
              {'  '}
              Products List
            </NavLink>
          </DropdownButton>
          <DropdownButton
            title={
              user === null ? '' : `${user.first_name} ${user.last_name}   `
            }
            bg="transparent"
          >
            <Nav.Item>
              <Nav.Link onClick={logout} href="#">
                <i className="fas fa-sign-out-alt"></i>
                {'  '}
                Logout
              </Nav.Link>
            </Nav.Item>
            <NavLink
              to="/edit-account"
              className="nav-link"
              activeClassName="active"
            >
              <i className="fas fa-user-edit"></i>
              {'  '}
              Edit password
            </NavLink>

            <Nav.Item>
              <Nav.Link onClick={deleteAccount} href="#">
                <i className="fas fa-user-minus"></i>
                {'  '}
                Delete Account
              </Nav.Link>
            </Nav.Item>
          </DropdownButton>
          <Image
            src={user === null ? '' : user.avatar}
            roundedCircle
            className="ml-3"
            style={{ width: '10%' }}
          />
        </Nav>
      </Navbar.Collapse>
    </>
  );

  const guestLinks = (
    <>
      <NavLink to="/">Stock App</NavLink>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <NavLink to="/register" className="nav-link" activeClassName="active">
            Register
          </NavLink>

          <NavLink to="/login" className="nav-link" activeClassName="active">
            Login
          </NavLink>
        </Nav>
      </Navbar.Collapse>
    </>
  );

  return (
    <Navbar bg="light" expand="lg">
      {!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}
    </Navbar>
  );
};

NavigationBar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout, deleteAccount })(
  NavigationBar,
);
