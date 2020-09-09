import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { first_name, last_name, email, password, password2 } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ first_name, last_name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <>
      <Form className="align-middle" onSubmit={(e) => onSubmit(e)}>
        <Row>
          <Col>
            <Form.Group controlId="first_name">
              <Form.Control
                type="text"
                placeholder="First Name"
                value={first_name}
                onChange={(e) => onChange(e)}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="last_name">
              <Form.Control
                type="text"
                placeholder="Last name"
                value={last_name}
                onChange={(e) => onChange(e)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="email">
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
          <Form.Text className="text-muted">
            8 or more characters long
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="password2">
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={password2}
            onChange={(e) => onChange(e)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
