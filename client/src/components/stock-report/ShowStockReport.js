import React, { useState, useEffect } from 'react';

import DeleteReportModal from '../selling-report-components/subcomponents/DeleteReportModal'
// import ConnectedUpdateReportAccordion from './subcomponents/ConnectedUpdateReportAccordion'
import ConnectedFacility from '../selling-report-components/subcomponents/ConnectedFacility'

import NumberFormat from 'react-number-format';
import getSymbolFromCurrency from 'currency-symbol-map';
import moment from 'moment';
import { connect } from 'react-redux';
import { showStockReportByDate,deleteStockReportByDate, } from '../../actions/stock-report';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

const ShowDailyReport = ({
  match,
  deleteStockReportByDate,
  showStockReportByDate,
  dailyStockReport,
  toggleSort,
}) => {
  const [chosenSort, setChosenSort] = useState('');
  const [chosenDate, setChosenDate] = useState('');
  const [uploadedStockReport, setUploadedStockReport] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  //set up the state with loaded report
  useEffect(() => {
    setUploadedStockReport(dailyStockReport.stockReport)
  }, [dailyStockReport]);


  useEffect(() => {
    const sorted = [...uploadedStockReport];
    sorted.sort((a, b) => {
      switch (chosenSort) {
        case 'Name(A-Z)':
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        case 'Amount in Stock ASC':
          return a.amount_in_stock - b.amount_in_stock;
        case 'Amount in Stock DESC':
          return b.amount_in_stock - a.amount_in_stock;
      }
    });

    setUploadedStockReport(sorted);
  }, [chosenSort]);


  const onChangeSort = (e) => {
    setChosenSort(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setChosenSort('');
    showStockReportByDate(match.params.id_facility, e.target.date.value);
  };

  const onChange = (e) => {
    setChosenDate(e.target.value);
  };
  
  return (
    <Container>
      <ConnectedFacility />
      <p className="text-info mb-4">
        Check Your restaurant stock report by selecting the date
      </p>
      <Form
        onSubmit={(e) => onSubmit(e)}
        className="d-flex align-items-end mb-5"
      >
        <Form.Group className="flex-grow-1 w-100 mr-3 mb-0">
          <Form.Label className="text-muted my-0">
            Choose the date first:
          </Form.Label>
          <Form.Control
            name="date"
            type="date"
            onChange={(e) => onChange(e)}
            max={moment().format('YYYY-MM-DD')}
            required
            disabled={toggleSort}
          />
        </Form.Group>
        <Button type="submit" variant="info">
          Search
        </Button>
      </Form>

      {dailyStockReport.loading && uploadedStockReport.length > 0 ? (
        <Spinner animation="border" />
      ) 
      :
       (
        uploadedStockReport.length > 0 && (
          <>
            <div className="d-flex justify-content-between align-items-end mb-3">
              <Form.Group
                controlId="exampleForm.ControlSelect1"
                className="flex-grow-1 mr-3 mb-3"
              >
                <Form.Label className="my-0 text-muted">Sort By:</Form.Label>
                <Form.Control
                  onChange={(e) => onChangeSort(e)}
                  as="select"
                  className="flex-grow-1 w-100"
                  disabled={toggleSort}
                >
                  <option value="" hidden>
                    Select your option
                  </option>
                  <option>Name(A-Z)</option>
                  <option>Amount in Stock ASC</option>
                  <option>Amount in Stock DESC</option>
                </Form.Control>
              </Form.Group>
              <Button
                className="mb-3"
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Report
              </Button>
              <DeleteReportModal
                show={showDeleteModal}
                deleteReport={deleteStockReportByDate}
                date={chosenDate}
                match={match}
                onHide={() => setShowDeleteModal(false)}
              />
            </div>
            <ListGroup>
              {uploadedStockReport.map((i, idx) => {
                return (
                  <ListGroup.Item
                    key={idx}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      <h5 className="my-0 text-success mr-5">{i.name}</h5>
                      <p className="my-0 text-info">{i.brand}</p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <p className="d-flex my-0 justify-content-center align-items-center">
                        <span className=" text-warning mr-1">Whole:</span>
                        <NumberFormat
                          value={i.whole}
                          displayType={'text'}
                          thousandSeparator={true}
                        />
                      </p>
                      <p className="d-flex justify-content-center align-items-center my-0 ml-1 mr-4">
                        Each
                      </p>
                      <p className="d-flex my-0 justify-content-center align-items-center">
                        <span className=" text-warning mr-1">
                          Loose:
                        </span>
                        <NumberFormat
                          value={i.loose}
                          displayType={'text'}
                          thousandSeparator={true}
                        />
                      </p>
                      <p className="d-flex justify-content-center align-items-center my-0 ml-1">
                        {i.measurment_type}
                      </p>
                      {/* <ConnectedUpdateReportAccordion
                        eventKey={idx}
                        dishItem={i.dish_id}
                        uploadedStockReport={uploadedStockReport}
                        match={match}
                      /> */}
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </>
        )
      )}
    </Container>

  )};

ShowDailyReport.propTypes = { 
  dailyStockReport: PropTypes.object.isRequired,
  showStockReportByDate: PropTypes.func.isRequired,
  deleteStockReportByDate: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  dailyStockReport: state.dailyStockReport,
  toggleSort: state.toggleSort,
});

export default connect(mapStateToProps, {
  showStockReportByDate,
  deleteStockReportByDate,
})(ShowDailyReport);
