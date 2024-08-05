import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom";
import { Note } from "./App";

type NoteLayoutProps = {
  notes: Note[];
}

export function NoteLayout({ notes } : NoteLayoutProps) {
  const { id } = useParams();
  const note : Note | undefined = notes.find(note => note.id === id);
  // Note not found
  // replace: replace the current location with the home page
  // also change the url
  if (note == undefined) {
    return (
      <Navigate to="/" replace/>
    )
  }
  
  // Note found
  // Outlet is a placeholder for nested routes
  return (
    <Outlet context={note}/>
  )
}

export function useNote() {
  return useOutletContext<Note>();
}