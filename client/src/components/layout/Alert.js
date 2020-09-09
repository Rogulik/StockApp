import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert as AlertContainer } from 'react-bootstrap';

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <AlertContainer key={alert.id} variant={alert.alertType}>
      {alert.msg}
    </AlertContainer>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
