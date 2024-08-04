import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import { Navigate, Route, Routes } from 'react-router-dom'
import NewNote from './NewNote'
import useLocalStorage from './useLocalStorage'
import { useMemo } from 'react'
import { v4 as uuidV4 } from 'uuid'

export type Note = {
  id: string;
} & NoteData

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
}

export type Tag = {
  id: string;
  label: string;
}

export type RawNote = {
  id: string;
} & RawNoteData

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);

  const noteWithTags = useMemo(() => {
    return notes.map(note => ({
      ...note,
      tags: tags.filter(tag => note.tagIds.includes(tag.id))
    }))
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    const note: RawNote = {
      id: uuidV4(),
      ...data,
      tagIds: tags.map(tag => tag.id)
    }
    setNotes([...notes, note]);
  }

  function onAddTag(tag: Tag) {
    setTags([...tags, tag]);
  }


  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={onAddTag} availableTags={tags}/>} />
        <Route path="/:id">
          <Route index element={<div>Show</div>}/>
          <Route path="edit" element={<div>Edit</div>}/>
        </Route>
        <Route path="/*" element={<Navigate to="/"/>} />
      </Routes>
    </Container>
  )
}

export default App
