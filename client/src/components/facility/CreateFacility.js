import React, { useState } from 'react';
import CreateFacilityForm from './CreateFacilityForm'
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createFacility } from '../../actions/facility';

const CreateFacility = ({ createFacility, history }) => {
  const blankFacility = {
    name: '',
    location: '',
    owner: '',
    establish_in: '',
    type: 'Restaurant',
  };
  const [formsData, setFormsData] = useState([{ ...blankFacility }]);

  const addFacility = () => {
    setFormsData([...formsData, { ...blankFacility }]);
  };

  const onChange = (e) => {
    const updatedFacility = [...formsData];
    updatedFacility[e.target.dataset.idx][e.target.name] = e.target.value;
    setFormsData(updatedFacility);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const toSendForms = [...formsData];
    toSendForms.map((i) => [
      i.establish_in.toString(),
      i.type.toLowerCase()
    ]);

    createFacility(toSendForms, history);
  };

  const deleteFormEvent = (i) => {
    const copyArray = [...formsData];
    copyArray.splice(i, 1);
    setFormsData(copyArray);
  };
  return (
      <CreateFacilityForm 
        onSubmit={onSubmit}
        formsData={formsData}
        onChange={onChange}
        addFacility={addFacility}
        deleteFormEvent={deleteFormEvent}
      />
  );
};

CreateFacility.propTypes = {
  createFacility: PropTypes.func.isRequired,
};

export default connect(null, { createFacility })(withRouter(CreateFacility));
