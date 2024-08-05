import { NoteData, Tag } from "./App";
import NoteForm from "./NoteForm";
import { useNote } from "./NoteLayout";

type EditNoteProps = {
  onSubmit: (id: string, note: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export default function EditNote({
  onSubmit,
  onAddTag,
  availableTags,
}: EditNoteProps) {
  const { id, title, markdown, tags } = useNote();
  return (
    <>
      <h1 className="mb-4">Edit Note</h1>
      <NoteForm
        onSubmit={(data) => onSubmit(id, data)}
        onAddTag={onAddTag}
        availableTags={availableTags}
        title={title}
        markdown={markdown}
        tags={tags}
      />
    </>
  );
}
