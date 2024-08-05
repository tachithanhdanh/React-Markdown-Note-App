import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { Tag } from "./App";

type EditTagsModalProps = {
  show: boolean;
  handleClose: () => void; // Function to close the modal
  availableTags: Tag[]; // List of available tags
  onUpdateTag: (id: string, label: string) => void; // Function to update a tag's label
  onDeleteTag: (id: string) => void; // Function to delete a tag
};

export default function EditTagsModal({
  show,
  handleClose,
  availableTags,
  onDeleteTag,
  onUpdateTag,
}: EditTagsModalProps) {
  return (
    // Create a modal with a form to edit tags
    // The form contains a list of tags with an input field to edit the tag label
    // and a button to delete the tag
    <Modal show={show} onHide={handleClose}>
      {/* Modal header with a close button */}
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {/* Render the list of tags with an input field and delete button */}
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    required
                    defaultValue={tag.label}
                    /* Update the tag label when the input field changes */
                    onChange={(element) => {
                      // Call the onUpdateTag function with the tag ID and the new label
                      onUpdateTag(tag.id, element.target.value);
                    }}
                  />
                </Col>
                <Col
                  xs="auto"
                  // Add a button to delete the tag
                  onClick={() => {
                    // Call the onDeleteTag function with the tag ID
                    onDeleteTag(tag.id);
                  }}
                >
                  <Button variant="outline-danger">&times;</Button>
                </Col>
              </Row>
            ))}
          </Stack>
          <hr />
          {/* Add a button to close the modal */}
          <Button variant="primary" className="float-end" onClick={handleClose}>
            Close
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
