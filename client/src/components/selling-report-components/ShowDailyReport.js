import React, { useState, useEffect } from 'react';

import ConnectedFacility from './subcomponents/ConnectedFacility'
import DeleteReportModal from './subcomponents/DeleteReportModal'
import ConnectedUpdateReportAccordion from './subcomponents/ConnectedUpdateReportAccordion'

import NumberFormat from 'react-number-format';
import getSymbolFromCurrency from 'currency-symbol-map';
import moment from 'moment';
import { connect } from 'react-redux';
import { showSellingReportByDate,deleteSellingReportByDate, } from '../../actions/sellingReport';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

const ShowDailyReport = ({
  match,
  deleteSellingReportByDate,
  showSellingReportByDate,
  dailySellingReport,
  toggleSort,
  
}) => {
  const [chosenSort, setChosenSort] = useState('');
  const [chosenDate, setChosenDate] = useState('');
  const [uploadedSellingReport, setUploadedSellingReport] = useState([]);
  const [summaryOfEarnedMoney, setSummaryOfEarnedMoney] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  //set up the state with loaded report
  useEffect(() => {
    setUploadedSellingReport(dailySellingReport.sellingReport);
  }, [dailySellingReport]);

  useEffect(() => {
    const sorted = [...uploadedSellingReport];
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
        case 'Sold Amount ASC':
          return a.sold_amount - b.sold_amount;
        case 'Sold Amount DESC':
          return b.sold_amount - a.sold_amount;
        case 'Earned Money ASC':
          return a.earned_money - b.earned_money;
        case 'Earned Money DESC':
          return b.earned_money - a.earned_money;
      }
    });

    setUploadedSellingReport(sorted);
  }, [chosenSort]);

  //setting up summary of earned money
  useEffect(() => {
    setSummaryOfEarnedMoney(
      uploadedSellingReport
        .map(({ earned_money, currency_type }) => ({
          earned_money: Number(earned_money),
          currency_type,
        }))
        .reduce((accumulator, cur) => {
          let date = cur.currency_type;
          let found = accumulator.find((elem) => elem.currency_type === date);
          if (found) found.earned_money += cur.earned_money;
          else accumulator.push(cur);
          return accumulator;
        }, []),
    );
  }, [uploadedSellingReport]);
  const onChangeSort = (e) => {
    setChosenSort(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setChosenSort('');
    showSellingReportByDate(match.params.id_facility, e.target.date.value);
  };

  const onChange = (e) => {
    setChosenDate(e.target.value);
  };
  //for changing the context for one item in array edit button
  return (
    <>
    <ConnectedFacility />
    <Container>
      <p className="text-info mb-4">
        Check Your restaurant report by selecting the date of the report
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

      { 
        dailySellingReport.loading && uploadedSellingReport.length > 0 ? (
        <Spinner animation="border" />
      ) : (
        uploadedSellingReport.length > 0 && (
          <>
            <div className="d-flex justify-content-between align-items-end mb-3">
              <Form.Group
                controlId="exampleForm.ControlSelect1"
                className="flex-grow-1 mr-3 mb-3"
              >
                <Form.Label className="my-0 text-muted">Sort By:</Form.Label>
                <Form.Control
                  onChange={(e) => onChangeSort(e)}
                  disabled={uploadedSellingReport.length === 0}
                  as="select"
                  className="flex-grow-1 w-100"
                  disabled={toggleSort}
                >
                  <option value="" hidden>
                    Select your option
                  </option>
                  <option>Name(A-Z)</option>
                  <option>Sold Amount ASC</option>
                  <option>Sold Amount DESC</option>
                  <option>Earned Money ASC</option>
                  <option>Earned Money DESC</option>
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
                deleteReport={deleteSellingReportByDate}
                date={chosenDate}
                match={match}
                onHide={() => setShowDeleteModal(false)}
              />
            </div>
            <ListGroup>
              {uploadedSellingReport.map((i, idx) => {
                return (
                  <ListGroup.Item
                    key={idx}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      <h5 className="my-0 text-success mr-5">{i.name}</h5>
                      <p className="my-0 text-info">{i.portion}</p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <p className="d-flex my-0 justify-content-center align-items-center mr-5">
                        <span className=" text-warning mr-1">Sold Amount:</span>

                        {i.sold_amount}
                      </p>
                      <p className="d-flex my-0 justify-content-center align-items-center">
                        <span className=" text-warning mr-1">
                          Earned Money:
                        </span>
                        <NumberFormat
                          value={i.earned_money}
                          displayType={'text'}
                          thousandSeparator={true}
                        />
                      </p>
                      <p className="d-flex justify-content-center align-items-center my-0 ml-1">
                        {getSymbolFromCurrency(i.currency_type)}
                      </p>
                      <ConnectedUpdateReportAccordion
                        eventKey={idx}
                        dishItem={i.dish_id}
                        uploadedSellingReport={uploadedSellingReport}
                        match={match}
                      />
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </>
        )
      )}
      <ListGroup className="my-5">
        {uploadedSellingReport.length > 0 && (
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-center align-items-center">
              <h5 className="my-0 text-success mr-5">
                Summary divided by currencies:
              </h5>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              {summaryOfEarnedMoney.map((i, idx) => (
                <div
                  className="mr-3 d-flex justify-content-center align-items-center"
                  key={idx}
                >
                  <NumberFormat
                    value={i.earned_money}
                    displayType={'text'}
                    thousandSeparator={true}
                  />
                  <p className="my-0 ml-1">
                    {getSymbolFromCurrency(i.currency_type)}
                  </p>
                </div>
              ))}
            </div>
          </ListGroup.Item>
        )}
      </ListGroup>
    </Container>
    </>
  );
};

ShowDailyReport.propTypes = {
  showSellingReportByDate: PropTypes.func.isRequired,
  showSellingReportByDate: PropTypes.func.isRequired,
  deleteSellingReportByDate: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  dailySellingReport: state.dailySellingReport,
  toggleSort: state.toggleSort,
});

export default connect(mapStateToProps, {
  showSellingReportByDate,
  deleteSellingReportByDate,
})(ShowDailyReport);
