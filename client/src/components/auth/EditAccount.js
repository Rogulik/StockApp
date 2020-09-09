import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { setAlert } from '../../actions/alert';
import { updateAccount } from '../../actions/auth';
import PropTypes from 'prop-types';

const EditAccount = ({ setAlert, updateAccount, history }) => {
  const [formData, setFormData] = useState({
    password: '',
    newPassword: '',
    newPassword2: '',
  });

  const { password, newPassword, newPassword2 } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== newPassword2) {
      setAlert('New password does not match with the confirmation.', 'danger');
    } else {
      updateAccount(password, newPassword, history);
    }
  };
  return (
    <>
      <Form className="align-middle" onSubmit={(e) => onSubmit(e)}>
        <Form.Group controlId="password">
          <Form.Control
            type="password"
            placeholder="Old Password"
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
          <Form.Text className="text-muted">
            Please provide Your old password
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="newPassword">
          <Form.Control
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => onChange(e)}
            required
          />
        </Form.Group>
        <Form.Group controlId="newPassword2">
          <Form.Control
            type="password"
            placeholder="Confir New Password"
            value={newPassword2}
            onChange={(e) => onChange(e)}
            required
          />
          <Form.Text className="text-muted">
            Please confirm the new password.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

EditAccount.propTypes = {
  setAlert: PropTypes.func.isRequired,
  updateAccount: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  userData: state.auth.user,
});

export default connect(mapStateToProps, { setAlert, updateAccount })(
  EditAccount,
);
