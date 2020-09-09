import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const UpdateProductForm = ({onSubmit,productToUpdate,onChangeForm,currency}) => {
    return(
        <Form onSubmit={onSubmit}>
      <Form.Group controlid="name">
        <Form.Label>Name:</Form.Label>
        <Form.Control
          type="text"
          name="name"
          placeholder="Product name *"
          value={productToUpdate.name}
          onChange={onChangeForm}
          className="name"
          required
        />
      </Form.Group>
      <Form.Group controlid="brand">
        <Form.Label>Brand: </Form.Label>
        <Form.Control
          type="text"
          name="portion"
          placeholder="Brand or Marketplace name *"
          className="brand"
          value={productToUpdate.brand}
          onChange={onChangeForm}
          required
        />
      </Form.Group>
      <Row>
        <Col>
          <Form.Group controlid="cost">
            <Form.Label>Cost: </Form.Label>
            <Form.Control
              type="number"
              name="cost"
              placeholder="Cost"
              className="portion"
              value={productToUpdate.cost}
              onChange={onChangeForm}
            />
            <Form.Text>Up to 6 digits and 2 decimals.</Form.Text>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlid="measurment_type">
            <Form.Label>Measurment:</Form.Label>
            <Form.Control
              as="select"
              name="measurment_type"
              className="measurment_type"
              value={productToUpdate.measurment_type}
              onChange={onChangeForm}
              required
            >
                <option>l</option>
                <option>kg</option>
                <option>g</option>
                <option>each</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
      <Col> 
        <Form.Group controlid="amount_in_container">
                <Form.Label>Amount in full bag or container:</Form.Label>
                <Form.Control
                type="number"
                name="amount_in_container"
                placeholder="Amount only *"
                className="amount_in_container"
                value={productToUpdate.amount_in_container}
                onChange={onChangeForm}
                />
                <Form.Text>Up to 6 digits and 2 decimals.</Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlid="currency_type">
            <Form.Label>Currency:</Form.Label>
            <Form.Control
            value={productToUpdate.currency_type}
            name="currency_type"
            as="select"
            onChange={onChangeForm}
            className="currency_type"
            required
            >
            {currency.currencies.map((i, index) => (
                <option key={index}>{i}</option>
            ))}
            </Form.Control>
        </Form.Group>
      </Col>
      </Row>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
    )
}
 

export default UpdateProductForm
