import React from 'react';
import { connect } from 'react-redux';
import { deleteFacility } from '../../actions/facility';
import { NavLink } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment';

const Restaurant = ({
  deleteFacility,
  name,
  owner,
  location,
  establish_in,
  restaurantId,
}) => {
  return (
    <>
      <Card border="primary" style={{ width: '18rem' }} key={restaurantId}>
        <Card.Header className="d-flex justify-content-between align-items-center ">
         <h5>{name}</h5>
          <i
            className="fas fa-store"
            style={{
              color: 'blue',
              padding: '5px',
              border: '2px solid blue',
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

          <Card.Link as={NavLink} to={`/connect-menu/${restaurantId}`}>
            Connect Menu
          </Card.Link>
          <Card.Link as={NavLink} to={`/connected-menu/${restaurantId}`}>
            Show connected Menus
          </Card.Link>
          <Card.Link as={NavLink} to={`/create-daily-report/${restaurantId}`}>
            Create Selling Report
          </Card.Link>
          <Card.Link as={NavLink} to={`/show-daily-report/${restaurantId}`}>
            Show Selling Report
          </Card.Link>
          <Card.Link as={NavLink} to={`/create-stock-report/${restaurantId}`}>
            Create Stock Report
          </Card.Link>
          <Card.Link as={NavLink} to={`/show-stock-report/${restaurantId}`}>
            Show Stock Report
          </Card.Link>
          <Button
            variant="danger"
            onClick={(e) => deleteFacility(restaurantId)}
          >
            Delete
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default connect(null, { deleteFacility })(Restaurant);
