import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { NavLink } from 'react-router-dom';

const MenuCard = ({
  menuId,
  menuName,
  category,
  deleteMenu,
  deleteRestaurantMenuConnections,
  showActions,
  showCheckbox,
  handleChange,
  showConnectionActions,
  restaurantId,
}) => {
  return (
    <Col key={menuId} className="p-2">
      <Card border="primary" style={{ width: '18rem' }}>
        <Card.Header className="d-flex justify-content-between align-items-center ">
          {showCheckbox && (
            <Form.Check
              type="checkbox"
              className="mb-3"
              id={menuId}
              label="Add"
              name={menuName}
              value={menuId}
              onChange={handleChange}
            />
          )}
          <h5>{menuName}</h5>
          <i className="fas fa-utensils"></i>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush" className="my-2">
            <ListGroup.Item key={menuId}>Category: {category}</ListGroup.Item>
          </ListGroup>
          {showActions && (
            <>
              <Card.Link as={NavLink} to={`/create-dish/${menuId}`}>
                Add Dishes
              </Card.Link>
              <Card.Link as={NavLink} to={`/show-dish/${menuId}`}>
                Show Dishes
              </Card.Link>
              <Card.Link href="#">Edit</Card.Link>
              <Button variant="danger" onClick={(e) => deleteMenu(menuId)}>
                Delete
              </Button>
            </>
          )}
          {showConnectionActions && (
            <Button
              onClick={(e) =>
                deleteRestaurantMenuConnections(menuId, restaurantId)
              }
            >
              Delete From List
            </Button>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

MenuCard.defaultProps = {
  showCheckbox: false,
  showActions: true,
  showConnectionActions: false,
};

export default MenuCard;
