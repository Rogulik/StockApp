import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { getUserFacility } from '../../../actions/facility';
import { withRouter } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';

const Facility = ({ facility, match, getUserFacility }) => {
    useEffect(() => {
      getUserFacility(match.params.id_facility);
    }, [getUserFacility, match.params.id_facility]);
    return facility.facility.loading ? (
      <Spinner animation="border" />
    ) : (
      <Container>
        <h1 className="text-primary">{facility.facility.name}</h1>
      </Container>
    );
  };
  

  Facility.propTypes = {
    facility: PropTypes.object.isRequired,
    getUserFacility: PropTypes.func.isRequired,
  }

  const ConnectedFacility = connect((state) => ({ facility: state.facility }), {
    getUserFacility,
  })(withRouter(Facility));

  export default ConnectedFacility