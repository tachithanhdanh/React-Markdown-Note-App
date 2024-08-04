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
};

export default function NoteForm({ onSubmit, onAddTag, availableTags } : NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const navigate = useNavigate();


  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags
    });
    navigate('..');
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" required ref={titleRef}/>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelectCreatable 
                options={availableTags.map(tag => ({ value: tag.id, label: tag.label }))}
                onCreateOption={ (label) => {
                  const tag: Tag = { id: uuidV4(), label };
                  onAddTag(tag);
                  setSelectedTags([...selectedTags, tag]);
                }}
                value={
                  selectedTags.map(tag => ({ value: tag.id, label: tag.label }))
                }
                onChange={(tags) => setSelectedTags(tags.map(tag => ({ id: tag.value, label: tag.label })))}
                isMulti 
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <Form.Control as="textarea" required rows={15} ref={markdownRef}/>
        </Form.Group>
        <Stack gap={2} className="justify-content-end" direction="horizontal">
          <Button variant="primary" type="submit">
            Save
          </Button>
          <Link to="..">
            <Button variant="outline-secondary">
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  )
}