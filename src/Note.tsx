import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import { useNote } from "./NoteLayout";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

type NoteProps = {
  onDelete: (id: string) => void;
};

export default function Note({ onDelete }: NoteProps) {
  const { id, title, markdown, tags } = useNote();
  const navigate = useNavigate();
  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>{title}</h1>
          {tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {tags.map((tag) => (
                <Badge key={tag.id}>{tag.label}</Badge>
              ))}
            </Stack>
          )}
        </Col>
        <Col>
          <Stack gap={2} className="justify-content-end" direction="horizontal">
            <Link to="edit">
              <Button variant="primary" type="submit">
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              type="submit"
              onClick={() => {
                onDelete(id);
                navigate("/");
              }}
            >
              Delete
            </Button>
            <Link to="..">
              <Button variant="outline-secondary">Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </>
  );
}
