import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const DeleteReportModal = (props) => {
    return (
      <Modal
        onHide={props.onHide}
        show={props.show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>After deleting the report, You will not be able to bring it back.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              props.deleteReport(props.match.params.id_facility, props.date);
              props.onHide();
            }}
          >
            Delete Anyway
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };


export default DeleteReportModal
