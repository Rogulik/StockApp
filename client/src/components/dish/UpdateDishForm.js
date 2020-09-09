import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const UpdateDishForm = ({onSubmit,dishToUpdate,onChangeForm,currency}) => {
    return(
        <Form onSubmit={onSubmit}>
      <Form.Group controlid="name">
        <Form.Label>Name:</Form.Label>
        <Form.Control
          type="text"
          name="name"
          placeholder="Dish name *"
          value={dishToUpdate.name}
          onChange={onChangeForm}
          className="name"
          required
        />
      </Form.Group>
      <Form.Group controlid="portion">
        <Form.Label>Portion:</Form.Label>
        <Form.Control
          type="text"
          name="portion"
          placeholder="Amount/Portion/Size *"
          className="portion"
          value={dishToUpdate.portion}
          onChange={onChangeForm}
          required
        />
      </Form.Group>
      <Row>
        <Col>
          <Form.Group controlid="to_make_cost">
            <Form.Label>Production Cost:</Form.Label>
            <Form.Control
              type="number"
              name="to_make_cost"
              placeholder="Cost to make"
              className="portion"
              value={dishToUpdate.to_make_cost}
              onChange={onChangeForm}
            />
            <Form.Text>Up to 6 digits and 2 decimals.</Form.Text>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlid="to_sell_price">
            <Form.Label>Selling Price:</Form.Label>
            <Form.Control
              type="number"
              name="to_sell_price"
              placeholder="Selling price *"
              className="portion"
              value={dishToUpdate.to_sell_price}
              onChange={onChangeForm}
              required
            />
            <Form.Text>Up to 6 digits and 2 decimals.</Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group controlid="currency_type">
        <Form.Label>Currency:</Form.Label>
        <Form.Control
          value={dishToUpdate.currency_type}
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
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
    )
}
 

export default UpdateDishForm
