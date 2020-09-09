import React,{useState,useEffect} from 'react'
import ConnectedContextAwareToggle from './ConnectedContextAwareToggle'
import { connect } from 'react-redux'
import { updateSingleItemFromReport } from '../../../actions/sellingReport'
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const UpdateReportAccordion = ({ eventKey, uploadedSellingReport,dishItem,toggleSort,updateSingleItemFromReport }) => {
    //deep copy of initial state to not override the original state
    const [copyOfReport, setCopyOfReport] = useState([])
    
    //everytime the edit card will pop up load the copy of the report to the state
    useEffect(() => {
        setCopyOfReport(JSON.parse(JSON.stringify(uploadedSellingReport)))
    },[eventKey])
  
    const onChange = (e) => {
      const updatedReport = [...copyOfReport];
      updatedReport[e.target.dataset.idx][e.target.name] = e.target.value;
      setCopyOfReport(updatedReport);
    };
  
    const incrementAmount = (id) => {
      const updatedReport = [...copyOfReport];
      updatedReport.map((i, idx) => ({
        ...i,
        sold_amount: i.dish_id === id ? i.sold_amount++ : i.sold_amount,
      }));
      setCopyOfReport(updatedReport);
    };
    
    const decrementAmount = (id) => {
      const updatedReport = [...copyOfReport];
      updatedReport.map((i, idx) => ({
        ...i,
        sold_amount:
          i.dish_id === id && i.sold_amount > 0
            ? (i.sold_amount -= 1)
            : i.sold_amount,
        earned_money:
          i.dish_id === id ? i.sold_amount * i.to_sell_price : i.earned_money,
      }));
      setCopyOfReport(updatedReport);
    };
  
    const onSubmit = (e) => {
      e.preventDefault()
      const updatedReport = [...copyOfReport];
      updatedReport.map((i,idx) => ({
        ...i,
        earned_money: (i.earned_money = i.sold_amount * i.to_sell_price),
      }))
      setCopyOfReport(updatedReport)
      
      //update single item from report
      updateSingleItemFromReport(copyOfReport[eventKey].restaurant_id,copyOfReport[eventKey].dish_id,copyOfReport[eventKey])
      
    }
    return copyOfReport.length > 0 ? (
      
      <Accordion defaultActiveKey="0" className="ml-3">
        <ConnectedContextAwareToggle type="button" eventKey={eventKey}>{toggleSort ? 'Cancel' : 'Edit'}</ConnectedContextAwareToggle>
        <Accordion.Collapse eventKey={eventKey} className="mt-2">
        <Form onSubmit={(e) => onSubmit(e)}>
            <ConnectedContextAwareToggle type="submit" buttonStyle='outline-success' eventKey={eventKey}>Submit</ConnectedContextAwareToggle>
          <div className="d-flex justify-content-center align-items-center">
          <Button
              onClick={() => decrementAmount(dishItem)}
              className="rounded-circle"
              disabled={copyOfReport[eventKey].sold_amount <= 0 ? true : false}
            >
              <i className="fas fa-minus-circle"></i>
            </Button>
            <Form.Group className="mx-2">
              <Form.Label className="text-muted my-0">Sold Amount:</Form.Label>
              <Form.Control
                className="text-center"
                type="number"
                name="sold_amount"
                data-idx={eventKey}
                value={copyOfReport[eventKey].sold_amount}
                onChange={(e) => onChange(e)}
                min={0}
                max={9999.99}
                required
              />
            </Form.Group>
            <Button
              className="rounded-circle"
              data-idx={eventKey}
              onClick={() => incrementAmount(dishItem)}
            >
              <i className="fas fa-plus-circle"></i>
            </Button>
          </div>
          </Form>  
        </Accordion.Collapse>
      </Accordion>
      
    ) : '';
  };
  
  const ConnectedUpdateReportAccordion = connect(
    (state) => ({
      toggleSort: state.toggleSort,
    }),{updateSingleItemFromReport}
  )(UpdateReportAccordion);

export default ConnectedUpdateReportAccordion
