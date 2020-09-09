import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createMenu } from '../../actions/menu';
import CreateMenuForm from './CreateMenuForm';

const CreateMenu = ({ createMenu, history }) => {
  const blankMenu = {
    name: '',
    category: '',
  };
  const [formsData, setFormsData] = useState([{ ...blankMenu }]);

  const addMenu = () => {
    setFormsData([...formsData, { ...blankMenu }]);
  };

  const onChange = (e) => {
    const updatedMenu = [...formsData];
    updatedMenu[e.target.dataset.idx][e.target.name] = e.target.value;
    setFormsData(updatedMenu);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    createMenu(formsData, history);
  };
  const deleteFormEvent = (i) => {
    const copyArray = [...formsData];
    copyArray.splice(i, 1);
    setFormsData(copyArray);
  };
  return (
      <CreateMenuForm 
        onSubmit={onSubmit}
        formsData={formsData}
        deleteFormEvent={deleteFormEvent}
        onChange={onChange}
        addMenu={addMenu}
      />
  );
};

CreateMenu.propTypes = {
  createMenu: PropTypes.func.isRequired,
};

export default connect(null, { createMenu })(withRouter(CreateMenu));
