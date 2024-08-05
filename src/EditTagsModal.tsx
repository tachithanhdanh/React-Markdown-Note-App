import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { Tag } from "./App";

type EditTagsModalProps = {
  show: boolean;
  handleClose: () => void;
  availableTags: Tag[];
  onUpdateTag: (id: string, label: string) => void;
  onDeleteTag: (id: string) => void;
};

export default function EditTagsModal({
  show,
  handleClose,
  availableTags,
  onDeleteTag,
  onUpdateTag,
}: EditTagsModalProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    required
                    defaultValue={tag.label}
                    onChange={(element) => {
                      onUpdateTag(tag.id, element.target.value);
                    }}
                  />
                </Col>
                <Col
                  xs="auto"
                  onClick={() => {
                    onDeleteTag(tag.id);
                  }}
                >
                  <Button variant="outline-danger">&times;</Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
