import React from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';
import { deleteFacility } from '../../actions/facility';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment';

const Warehouse = ({
  deleteFacility,
  name,
  owner,
  location,
  establish_in,
  warehouseId,
}) => {
  return (
    <>
      <Card border="success" style={{ width: '18rem' }}>
        <Card.Header className="d-flex justify-content-between align-items-center ">
        <h5>{name}</h5>
          <i
            className="fas fa-warehouse"
            style={{
              color: 'green',
              padding: '5px',
              border: '2px solid green',
              borderRadius: '10px',
            }}
          ></i>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush" className="my-2">
            <ListGroup.Item>Owner: {owner}</ListGroup.Item>
            <ListGroup.Item>Adress: {location}</ListGroup.Item>
            <ListGroup.Item>
              Established: {moment(establish_in, 'YYYYMMDD').fromNow()}
            </ListGroup.Item>
          </ListGroup>
          <Card.Link as={NavLink} to={`/create-stock-report/${warehouseId}`}>
            Create Stock Report
          </Card.Link>
          <Card.Link as={NavLink} to={`/show-stock-report/${warehouseId}`}>
            Show Stock Report
          </Card.Link>
          <Card.Link href="#">Edit Facility</Card.Link>
          <Button variant="danger" onClick={(e) => deleteFacility(warehouseId)}>
            Delete
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default connect(null, { deleteFacility })(Warehouse);
