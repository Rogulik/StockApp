import React from 'react';
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const CreateProductForm = ({
  currencies,
  chosenCurrency,
  formsData,
  showForm,
  onChangeForm,
  addProduct,
  onSubmit,
  addCurrency,
  deleteFormEvent,
}) => {
  return (
    <>
      <h1 className="my-4">Add one or more Products</h1>
      <Form className="align-middle" onSubmit={(e) => onSubmit(e)}>
        <Form.Group controlid={0}>
          <Form.Label className="text-muted">
            Please choose the currency first to add products:
          </Form.Label>
          <Form.Control
            value={chosenCurrency}
            name="currency_type"
            as="select"
            onChange={(e) => addCurrency(e)}
            className="currency_type"
            required
          >
            <option value="" selected disabled hidden="hidden">Choose Currency</option>
            {currencies.map((i, index) => (
              <option key={index}>{i}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Text>* - required</Form.Text>
        {formsData.map((val, idx) => {
          const productId = `product-${idx}`;
          const nameId = `name-${idx}`;
          const costId = `cost-${idx}`;
          const amountInContainerId = `amount_in_container-${idx}`;
          const brandId = `brand-${idx}`;
          const measurmentTypeId = `measurment_type-${idx}`
          return (
            <Container
              className="shadow p-3 mb-5 bg-white rounded position-relative"
              key={productId}
            >
              <Button
                className="position-absolute"
                style={{ top: 0, right: 0, zIndex: 10 }}
                onClick={() => deleteFormEvent(idx)}
              >
                X
              </Button>
              <Row>
              <Col>
                <Form.Group controlid={nameId}>
                <Form.Label className="text-muted">
                      Please provide the name of the product.
                    </Form.Label>
                    <Form.Control
                    type="text"
                    name="name"
                    placeholder="Product name *"
                    data-idx={idx}
                    value={formsData[idx].name}
                    onChange={onChangeForm}
                    className="name"
                    required
                    disabled={showForm}
                    />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlid={brandId}>
                    <Form.Label className="text-muted">
                      Please provide the brand or marketplace name.
                    </Form.Label>
                    <Form.Control
                    type="text"
                    name="brand"
                    placeholder="Brand or Marketplace name*"
                    data-idx={idx}
                    className="portion"
                    value={formsData[idx].brand}
                    onChange={onChangeForm}
                    required
                    disabled={showForm}
                    />
                </Form.Group>
              </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlid={costId}>
                    <Form.Label className="text-muted">
                      Please provide cost of the product
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="cost"
                      placeholder="Cost of the product*"
                      data-idx={idx}
                      className="cost"
                      value={formsData[idx].cost}
                      onChange={onChangeForm}
                      disabled={showForm}
                      min={0}
                      max={999999.99}
                    />
                    <Form.Text>Up to 6 digits and 2 decimals.</Form.Text>
                  </Form.Group>
                </Col>
                <Col>
                <Form.Group controlid={measurmentTypeId}>
                    <Form.Label className="text-muted">
                        Measure type:
                    </Form.Label>
                    <Form.Control
                        name="measurment_type"
                        onChange={onChangeForm}
                        disabled={showForm}
                        value={formsData[idx].measurment_type}
                        data-idx={idx}
                        name="measurment_type"
                        as="select"
                        onChange={onChangeForm}
                        className="measurment_type"
                        required
                    >
                        <option value="" disabled hidden>Choose measure</option>
                        <option>l</option>
                        <option>kg</option>
                        <option>g</option>
                        <option>each</option>
                    </Form.Control>
                </Form.Group>
                </Col>
              </Row>
              <Form.Group controlid={amountInContainerId}>
                    <Form.Label className="text-muted">
                      Please provide only the amount of the product contained in a signle bag or container.
                      If the product is only sold as single leave it empty.
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="amount_in_container"
                      placeholder="Amount in bag or container"
                      data-idx={idx}
                      className="amount_in_container"
                      min={0}
                      max={9999.99}
                      value={formsData[idx].amount_in_container}
                      onChange={onChangeForm}
                      disabled={showForm}
                    />
                    <Form.Text>Up to 6 digits and 2 decimals.</Form.Text>
                  </Form.Group>
            </Container>
          );
        })}
        <Container className="d-flex justify-content-between">
          <Button onClick={addProduct} variant="info" disabled={showForm}>
            <i className="fas fa-plus-circle"></i> {'  '}
            Add new
          </Button>
          <Button variant="primary" type="submit" disabled={showForm}>
            Submit
          </Button>
        </Container>
      </Form>
    </>
  );
};

CreateProductForm.propTypes = {
  currencies: PropTypes.array.isRequired,
  formsData: PropTypes.array.isRequired,
  showForm: PropTypes.bool.isRequired,
  onChangeForm: PropTypes.func.isRequired,
  addProduct: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  addCurrency: PropTypes.func.isRequired,
  deleteFormEvent: PropTypes.func.isRequired,
}

export default CreateProductForm;
