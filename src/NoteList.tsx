import { useMemo, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Note, Tag } from "./App";
import NoteCard from "./NoteCard";
import EditTagsModal from "./EditTagsModal";

type NoteListProps = {
  availableTags: Tag[];
  notes: Note[];
  onUpdateTag: (id: string, label: string) => void;
  onDeleteTag: (id: string) => void;
};

export default function NoteList({ availableTags, notes, onUpdateTag, onDeleteTag }: NoteListProps) {
  // Define the state for selectedTags, title, and showEditTagsModal
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]); // State for selected tags
  const [title, setTitle] = useState<string>(""); // State for title
  const [showEditTagsModal, setShowEditTagsModal] = useState<boolean>(false); // State for showing the edit tags modal

  // Filter notes based on selected tags and title
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // if title is not empty and note title does not include title, return false
      if (title && !note.title.toLowerCase().includes(title.toLowerCase())) {
        return false;
      }
      // if selectedTags is not empty and note does not have all selected tags, return false
      if (
        selectedTags.length > 0 &&
        !selectedTags.every((tag) =>
          note.tags.some((noteTag) => noteTag.id === tag.id)
        )
      ) {
        return false;
      }
      // if all conditions are met, return true
      // or if title is empty and selectedTags is empty, return true
      return true;
    });
  }, [notes, title, selectedTags]); // Recalculate when notes, title, or selectedTags change

  return (
    <>
      {/*Create a row with a title and buttons to create a new note and edit tags */}
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          {/* Create a stack with buttons to create a new note and edit tags */}
          <Stack gap={2} direction="horizontal">
            {/* redirect to /new when create button is clicked */}
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            {/* Show edit tags modal when edit tags button is clicked */}
            <Button
              variant="outline-secondary"
              onClick={() => setShowEditTagsModal(true)}
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              {/* Search bar for title */}
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                // Update the title when the input field changes
                onChange={(element) => setTitle(element.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              {/* ReactSelect component for selecting tags */}
              <ReactSelect
                // convert availableTags to options
                options={availableTags.map((tag) => ({
                  value: tag.id,
                  label: tag.label,
                }))}
                // convert selectedTags to value
                // value represents the selected tags
                value={selectedTags.map((tag) => ({
                  value: tag.id,
                  label: tag.label,
                }))}
                // Update the selected tags when the input field changes
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
      </Form>
      {/* Create a row with a grid of NoteCard components */}
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {/* Render the NoteCard component for each note */}
        {filteredNotes.map((note) => (
          // Render the NoteCard component with the note ID, title, and tags
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>
      {/* The EditTagsModal component */}
      {/* Modal to show the tags and edit or delete if necessary */}
      <EditTagsModal
        show={showEditTagsModal}
        handleClose={() => setShowEditTagsModal(false)} // Close the modal when the close button is clicked
        availableTags={availableTags}
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
      />
    </>
  );
}
