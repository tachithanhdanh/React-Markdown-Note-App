import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS for styling
import { Container } from "react-bootstrap"; // Importing Container component from react-bootstrap
import { Navigate, Route, Routes } from "react-router-dom"; // Importing components from react-router-dom for routing
import NewNote from "./NewNote"; // Importing NewNote component for creating a new note
import useLocalStorage from "./useLocalStorage"; // Importing custom hook for using local storage
import { useMemo } from "react"; // Importing useMemo hook for memoizing values
import { v4 as uuidV4 } from "uuid"; // Importing uuid for generating unique IDs
import NoteList from "./NoteList"; // Importing NoteList component for displaying list of notes
import { NoteLayout } from "./NoteLayout"; // Importing NoteLayout component for note layout
import Note from "./Note"; // Importing Note component for displaying a single note
import EditNote from "./EditNote"; // Importing EditNote component for editing a note

// Define the types for the Note, NoteData, Tag, RawNote, and RawNoteData
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
  // Use custom hook to manage notes and tags in local storage
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  // Memoize notes with their tags to avoid unnecessary recalculations
  // Only recalculate when notes or tags change
  const noteWithTags = useMemo(() => {
    return notes.map((note) => ({
      ...note,
      tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
    }));
  }, [notes, tags]);

  // Function to create a new note
  function onCreateNote({ tags, ...data }: NoteData) {
    // create a new note with a unique ID and tag IDs
    const note: RawNote = {
      id: uuidV4(),
      ...data,
      tagIds: tags.map((tag) => tag.id),
    };
    // add the new note to the notes array
    // this triggers a re-render of the NoteList component
    // and also saves the updated notes to local storage
    setNotes([...notes, note]);
  }

  // Function to add a new tag
  function onAddTag(tag: Tag) {
    // this function is called when a new tag is added in the NewNote or EditNote component
    // add the new tag to the tags array
    // this triggers a re-render of the NewNote or EditNote component
    // and also saves the updated tags to local storage
    setTags([...tags, tag]);
  }

  // Function to update an existing note
  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    // only update the note with the given ID
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

  // Function to delete a note
  function onDeleteNote(id: string) {
    // filter out the note with the given ID
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
  }

  // Function to update a tag's label
  function onUpdateTag(id: string, label: string) {
    const newTags = tags.map((tag) => {
      if (tag.id === id) {
        return { ...tag, label };
      }
      return tag;
    });
    setTags(newTags);
  }

  // Function to delete a tag
  function onDeleteTag(id: string) {
    const newTags = tags.filter((tag) => tag.id !== id);
    setTags(newTags);
  }

  return (
    // Wrap the app with the Container component from react-bootstrap
    // my-4 is a margin utility class that adds margin to the top and bottom of the container
    <Container className="my-4">
      {/* Define the routes for the app */}
      <Routes>
        {/* Define the route for the home page */}
        {/* element prop is used to define the component to render for the route */}
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
        {/* Define the route for creating a new note */}
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
        {/* Define the route for a specific note */}
        {/* Nested routes for displaying a note and editing a note */}
        {/* :id is a URL parameter which is a feature of dynamic routes  */}
        {/* URL parameters can be accessed via useParams() Hook */}
        <Route path="/:id" element={<NoteLayout notes={noteWithTags} />}>
          {/* Route with index attribute belongs to parent route */}
          <Route index element={<Note onDelete={onDeleteNote} />} />
          {/* edit is a child route of the note route */}
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
        {/* Fallback route to navigate to the home page */}
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
