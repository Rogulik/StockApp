import React from 'react'
import moment from 'moment';
import  Form  from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import  Row  from 'react-bootstrap/Row';
import  Col  from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const CreateFacilityForm = ({onSubmit,formsData,onChange,addFacility,deleteFormEvent}) => {
    return (
        <Form className="align-middle" onSubmit={(e) => onSubmit(e)}>
        <h1 className="my-4">Add one or more facilities</h1>
        {formsData.map((val, idx) => {
          const facilityId = `facility-${idx}`;
          const nameId = `name-${idx}`;
          const locationId = `location-${idx}`;
          const ownerId = `owner-${idx}`;
          const establishInId = `establishIn-${idx}`;
          const typeId = `type-${idx}`;

          return (
            <Container
              className="shadow p-3 mb-5 bg-white rounded position-relative"
              key={facilityId}
            >
              <Button
                className=" position-absolute"
                style={{ top: 0, right: 0, zIndex: 10 }}
                onClick={() => deleteFormEvent(idx)}
              >
                X
              </Button>
              <Row>
                <Col>
                  <Form.Group controlid={nameId}>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Facility Name"
                      data-idx={idx}
                      value={formsData[idx].name}
                      onChange={onChange}
                      className="name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlid={ownerId}>
                    <Form.Control
                      type="text"
                      name="owner"
                      placeholder="Owner Name"
                      data-idx={idx}
                      className="owner"
                      value={formsData[idx].owner}
                      onChange={onChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlid={locationId}>
                <Form.Control
                  type="text"
                  name="location"
                  className="location"
                  data-idx={idx}
                  placeholder="Adress"
                  value={formsData[idx].location}
                  onChange={onChange}
                  required
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group controlid={establishInId}>
                    <Form.Label className="text-muted">
                      Establishment Date:
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="establish_in"
                      max={moment().format('YYYY-MM-DD')}
                      placeholder="Establishment Date"
                      data-idx={idx}
                      value={formsData[idx].establish_in}
                      onChange={onChange}
                      className="establish_in"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlid={typeId}>
                    <Form.Label className="text-muted">
                      Facility type:
                    </Form.Label>
                    <Form.Control
                      name="type"
                      as="select"
                      placeholder="Choose type"
                      value={ formsData[idx].type }
                      data-idx={idx}
                      onChange={onChange}
                      className="type"
                      required
                    >
                      <option>Restaurant</option>
                      <option>Warehouse</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Container>
          );
        })}
        <Container className="d-flex justify-content-between">
          <Button onClick={addFacility} variant="info">
            <i className="fas fa-plus-circle"></i> {'  '}
            Add new
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Container>
      </Form>
    )
}

export default CreateFacilityForm
