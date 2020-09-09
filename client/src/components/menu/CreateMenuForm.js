import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

const CreateMenuForm = ({onSubmit,onChange,addMenu,formsData,deleteFormEvent}) => {
    return (
        <Form className="align-middle" onSubmit={(e) => onSubmit(e)}>
        <h1 className="my-4">Add one or more Menus</h1>
        {formsData.map((val, idx) => {
          const MenuId = `facility-${idx}`;
          const nameId = `name-${idx}`;
          const categoryId = `name-${idx}`;
          return (
            <Container
              className="shadow p-3 mb-5 bg-white rounded position-relative"
              key={MenuId}
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
                  placeholder="Menu Name"
                  data-idx={idx}
                  value={formsData[idx].name}
                  onChange={onChange}
                  className="name"
                  required
                />
              </Form.Group>
              <Form.Group controlid={categoryId}>
                <Form.Control
                  type="text"
                  name="category"
                  placeholder="Category"
                  data-idx={idx}
                  className="category"
                  value={formsData[idx].category}
                  onChange={onChange}
                  required
                />
              </Form.Group>
            </Container>
          );
        })}
        <Container className="d-flex justify-content-between">
          <Button onClick={addMenu} variant="info">
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

export default CreateMenuForm
