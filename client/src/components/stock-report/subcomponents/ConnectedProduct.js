import React, {useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProducts } from '../../../actions/product';
import { createStockReport } from '../../../actions/stock-report';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup'

const Product = ({
    match,
    history,
    product,
    getProducts,
    createStockReport,
  }) => {

    const [formsData, setFormsData] = useState([]);
    const [chosenDate, setChosenDate] = useState('');

    console.log(chosenDate)

    //getting products from the database
    useEffect(() => {
      getProducts();
    }, []);
    console.log(formsData)

    //filling up the state for each product
    useEffect(() => {
      setFormsData(product.products.map((i) => ({
        product: i.id_product,
        amount_in_container: i.amount_in_container,
        whole:0,
        loose:0,
        amount_in_stock: 0,
        comment: ''
      })))
    },[product.loading]) 
  
    const onChange = (e) => {
      const updatedReport = [...formsData];
      updatedReport[e.target.dataset.idx][e.target.name] = e.target.value;
      setFormsData(updatedReport);
    };

    const incrementWhole = 
      (id) => {
        const updatedReport = [...formsData];
        updatedReport.map((i, idx) => ({
          ...i,
          whole: i.product === id ? i.whole++ : i.whole,
        }));
        setFormsData(updatedReport);
      }
  
    const decrementWhole = 
      (id) => {
        const updatedReport = [...formsData];
        updatedReport.map((i, idx) => ({
          ...i,
          whole:
            i.product === id && i.whole > 0
              ? (i.whole -= 1)
              : i.whole
        }));
        setFormsData(updatedReport);
      };

      const incrementLoose = 
      (id) => {
        const updatedReport = [...formsData];
        updatedReport.map((i, idx) => ({
          ...i,
          loose: i.product === id ? i.loose++ : i.loose,
        }));
        setFormsData(updatedReport);
      }
  
    const decrementLoose = 
      (id) => {
        const updatedReport = [...formsData];
        updatedReport.map((i, idx) => ({
          ...i,
          loose:
            i.product === id && i.loose > 0
              ? (i.loose -= 1)
              : i.loose
        }));
        setFormsData(updatedReport);
      };

   
    
  const onSubmit = (e) => {
      e.preventDefault();
      const updatedReport = [...formsData]

      updatedReport.map(i => ({
        ...i,
        amount_in_stock: i.amount_in_stock = i.amount_in_container * i.whole + i.loose
      }))
      setFormsData(updatedReport)
      createStockReport(match.params.id_facility,chosenDate, formsData, history);
    };
    return product.loading || formsData.length === 0 ? (
      <Spinner animation="border" />
    ) : product.products.length === 0 ? (
      <Container>
        There is no products created for you yet. Please make sure to
        create a products by clicking <Link to='/create-product'> here </Link>.
      </Container>
    ) : (
      <Container>
        <h4>Create Stock Report</h4>
        <Form className="mt-5" onSubmit={(e) => onSubmit(e)}>
          <Form.Group>
            <Form.Label className="text-muted">Choose the date for report:</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={chosenDate}
              onChange={(e) => setChosenDate(e.target.value)}
              max={moment().format('YYYY-MM-DD')}
              required
            />
          </Form.Group>
          <ListGroup>
          {product.products.map((product,idx) => (
            <ListGroup.Item
              key={idx}
              className="d-flex justify-content-between align-items-center "
            >
              <div className="d-flex justify-content-center align-items-center">
                <h5 className="my-0 text-success mr-5">{product.name}</h5>
                <p className="my-0 text-info">{product.brand}</p>
              </div>
              <div className="d-flex justify-content-center align-items-center">

                <Button
                  onClick={() => decrementWhole(product.id_product)}
                  className="rounded-circle"
                  disabled={formsData[idx].whole <= 0 ? true : false}
                >
                  <i className="fas fa-minus-circle"></i>
                </Button>
                <Form.Group className="mx-2">
                  <Form.Label className="text-muted my-0">
                    Whole:
                  </Form.Label>
                  <Form.Control
                    className="text-center"
                    type="number"
                    name="whole"
                    data-idx={idx}
                    value={formsData[idx].whole}
                    onChange={(e) => onChange(e)}
                    min={0}
                    max={9999}
                    step="1"
                  />
                  <Form.Text>Each</Form.Text>
                </Form.Group>
                <Button
                  className="rounded-circle"
                  data-idx={idx}
                  onClick={() => incrementWhole(product.id_product)}
                >
                  <i className="fas fa-plus-circle"></i>
                </Button>
              </div>
              <div className="d-flex justify-content-center align-items-center">

              <Button
                onClick={() => decrementLoose(product.id_product)}
                className="rounded-circle"
                disabled={formsData[idx].loose <= 0 ? true : false}
              >
                <i className="fas fa-minus-circle"></i>
              </Button>
              <Form.Group className="mx-2">
                <Form.Label className="text-muted my-0">
                  Loose:
                </Form.Label>
                <Form.Control
                  className="text-center"
                  type="number"
                  name="loose"
                  data-idx={idx}
                  value={formsData[idx].loose}
                  onChange={(e) => onChange(e)}
                  min={0}
                  max={999999}
                  required
                />
                <Form.Text>{product.measurment_type}</Form.Text>
              </Form.Group>
              <Button
                className="rounded-circle"
                data-idx={idx}
                onClick={() => incrementLoose(product.id_product)}
              >
                <i className="fas fa-plus-circle"></i>
              </Button>
              </div>
              <Form.Group className='text-muted my-0'>
                <Form.Label>Comment:</Form.Label>
                <Form.Control 
                  as="textarea"
                  name="comment"
                  data-idx={idx}
                  value={formsData[idx].comment}
                  onChange={(e) => onChange(e)}
                  rows="2" />
              </Form.Group>
                </ListGroup.Item>
          ))}
          </ListGroup>
          <Button variant="info" type="submit" className='mt-3'>
            Create Report
          </Button>
        </Form>
      </Container>
    );
  };

  Product.propTypes = {
      product: PropTypes.object.isRequired,
      getProducts: PropTypes.func.isRequired,
      createStockReport: PropTypes.func.isRequired,
  }
  
  const ConnectedProduct = connect(
    (state) => ({
      product: state.product,
    }),
    {
      getProducts,
      createStockReport,
    },
  )(withRouter(Product));

  export default ConnectedProduct