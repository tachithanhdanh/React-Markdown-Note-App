import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import NewNote from "./NewNote";
import useLocalStorage from "./useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import NoteList from "./NoteList";
import { NoteLayout } from "./NoteLayout";
import Note from "./Note";
import EditNote from "./EditNote";

export type Note = {
  id: string;
} & NoteData;

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const noteWithTags = useMemo(() => {
    return notes.map((note) => ({
      ...note,
      tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
    }));
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    const note: RawNote = {
      id: uuidV4(),
      ...data,
      tagIds: tags.map((tag) => tag.id),
    };
    setNotes([...notes, note]);
  }

  function onAddTag(tag: Tag) {
    setTags([...tags, tag]);
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    const newNotes = notes.map((note) => {
      if (note.id === id) {
        return {
          id,
          ...data,
          tagIds: tags.map((tag) => tag.id),
        };
      }
      return note;
    });
    setNotes(newNotes);
  }

  function onDeleteNote(id: string) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
  }

  function onUpdateTag(id: string, label: string) {
    const newTags = tags.map((tag) => {
      if (tag.id === id) {
        return { ...tag, label };
      }
      return tag;
    });
    setTags(newTags);
  }

  function onDeleteTag(id: string) {
    const newTags = tags.filter((tag) => tag.id !== id);
    setTags(newTags);
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              availableTags={tags}
              notes={noteWithTags}
              onUpdateTag={onUpdateTag}
              onDeleteTag={onDeleteTag}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={onAddTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={noteWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={onAddTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
