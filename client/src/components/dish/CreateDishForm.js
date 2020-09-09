import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const CreateDishForm = ({
  currencies,
  chosenCurrency,
  formsData,
  showForm,
  onChangeForm,
  addDish,
  onSubmit,
  addCurrency,
  deleteFormEvent,
}) => {
  return (
    <>
      <h1 className="my-4">Add one or more Dishes</h1>
      <Form className="align-middle" onSubmit={(e) => onSubmit(e)}>
        <Form.Group controlid={0}>
          <Form.Label className="text-muted">
            Please choose the currency first to add dishes:
          </Form.Label>
          <Form.Control
            value={chosenCurrency}
            name="currency_type"
            as="select"
            onChange={(e) => addCurrency(e)}
            className="currency_type"
            required
          >
            <option value="" selected disabled hidden>Choose currency</option>
            {currencies.map((i, index) => (
              <option key={index}>{i}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Text>* - required</Form.Text>
        {formsData.map((val, idx) => {
          const dishId = `facility-${idx}`;
          const nameId = `name-${idx}`;
          const to_make_cost_id = `to_make_cost_id-${idx}`;
          const to_sell_price_id = `to_sell_price_id-${idx}`;
          const portionId = `portionId-${idx}`;
          return (
            <Container
              className="shadow p-3 mb-5 bg-white rounded position-relative"
              key={dishId}
            >
              <Button
                className=" position-absolute"
                style={{ top: 0, right: 0, zIndex: 10 }}
                onClick={() => deleteFormEvent(idx)}
              >
                X
              </Button>
              <Form.Group controlid={nameId}>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Dish name *"
                  data-idx={idx}
                  value={formsData[idx].name}
                  onChange={onChangeForm}
                  className="name"
                  required
                  disabled={showForm}
                />
              </Form.Group>
              <Form.Group controlid={portionId}>
                <Form.Control
                  type="text"
                  name="portion"
                  placeholder="Amount/Portion/Size *"
                  data-idx={idx}
                  className="portion"
                  value={formsData[idx].portion}
                  onChange={onChangeForm}
                  required
                  disabled={showForm}
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group controlid={to_make_cost_id}>
                    <Form.Label className="text-muted">
                      Please type in production cost per dish
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="to_make_cost"
                      placeholder="Cost to make"
                      data-idx={idx}
                      className="portion"
                      min={0}
                      max={999999.99}
                      value={formsData[idx].to_make_cost}
                      onChange={onChangeForm}
                      disabled={showForm}
                    />
                    <Form.Text>Up to 6 digits and 2 decimals.</Form.Text>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlid={to_sell_price_id}>
                    <Form.Label className="text-muted">
                      Please type in selling price per dish
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="to_sell_price"
                      placeholder="Selling price *"
                      data-idx={idx}
                      className="portion"
                      min={0}
                      max={999999.99}
                      value={formsData[idx].to_sell_price}
                      onChange={onChangeForm}
                      required
                      disabled={showForm}
                    />
                    <Form.Text>Up to 6 digits and 2 decimals.</Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </Container>
          );
        })}
        <Container className="d-flex justify-content-between">
          <Button onClick={addDish} variant="info" disabled={showForm}>
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

export default CreateDishForm;
