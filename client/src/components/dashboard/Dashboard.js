import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUserFacilities } from '../../actions/facility';
import { NavLink } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Restaurant from '../facility/Restaurant';
import Warehouse from '../facility/Warehouse';

const Dashboard = ({
  getUserFacilities,
  facility: { facilities, loading },
}) => {
  useEffect(() => {
    getUserFacilities();
  }, [getUserFacilities]);
  return loading ? (
    <Spinner animation="border" />
  ) : (
    <Row>
      {facilities.length === 0 ? (
        <div>
          <p>No facilities to display yet, please create new one.</p>
          <NavLink to="/create-facility" className="btn btn-primary my-1">
            Create Facility
          </NavLink>
        </div>
      ) : (
        facilities.map((i) => {
          return i.type === 'restaurant' ? (
            <Col key={i.id_facility} className="p-2">
              <Restaurant
                name={i.name}
                location={i.location}
                owner={i.owner}
                establish_in={i.establish_in}
                restaurantId={i.id_facility}
              />
            </Col>
          ) : (
            <Col key={i.id_facility + 1} className="p-2">
              <Warehouse
                name={i.name}
                location={i.location}
                owner={i.owner}
                establish_in={i.establish_in}
                warehouseId={i.id_facility}
              />
            </Col>
          );
        })
      )}
    </Row>
  );
};

Dashboard.propTypes = {
  facility: PropTypes.object.isRequired,
  getUserFacilities: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  facility: state.facility,
});

export default connect(mapStateToProps, { getUserFacilities })(Dashboard);
