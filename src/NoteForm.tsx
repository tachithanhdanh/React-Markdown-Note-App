import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ReactSelectCreatable from "react-select/creatable";
import { NoteData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid";

type NoteFormProps = {
  onSubmit: (note: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NoteData>;
// Parital<NoteData> is used to make the NoteData properties optional
// You can either pass all the properties of NoteData or none of them

export default function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  markdown = "",
  tags = [],
}: NoteFormProps) {
  // Create references for the title and markdown input fields
  // the useRef hook is used to access the input field values
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate(); // useNavigate hook is used to navigate to a different route

  // Function to handle form submission
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    // prevent the default form submission which is reloading the page
    event.preventDefault(); 
    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
    });
    navigate("..");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" required ref={titleRef} defaultValue={title} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelectCreatable
                options={availableTags.map((tag) => ({
                  value: tag.id,
                  label: tag.label,
                }))}
                onCreateOption={(label) => {
                  const tag: Tag = { id: uuidV4(), label };
                  onAddTag(tag);
                  setSelectedTags([...selectedTags, tag]);
                }}
                value={selectedTags.map((tag) => ({
                  value: tag.id,
                  label: tag.label,
                }))}
                onChange={(tags) =>
                  setSelectedTags(
                    tags.map((tag) => ({ id: tag.value, label: tag.label }))
                  )
                }
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <Form.Control
            as="textarea"
            required
            rows={15}
            ref={markdownRef}
            defaultValue={markdown}
          />
        </Form.Group>
        <Stack gap={2} className="justify-content-end" direction="horizontal">
          <Button variant="primary" type="submit">
            Save
          </Button>
          <Link to="..">
            <Button variant="outline-secondary">Cancel</Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
}
