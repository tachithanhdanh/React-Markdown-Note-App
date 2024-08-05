import { Link } from "react-router-dom";
import { Tag } from "./App";
import {
  Badge,
  Card,
  CardBody,
  CardTitle,
  Stack,
} from "react-bootstrap";
import styles from "./NoteCard.module.css";

type SimplifiedNote = {
  id: string;
  title: string;
  tags: Tag[];
};

export default function NoteCard({ id, title, tags }: SimplifiedNote) {
  return (
    /* Add the necessary props to the Card component */
    /* h-100: fill max height */
    /* text-reset: remove text decoration */
    /* text-decoration-none: remove text decoration */
    /* NoteCard: custom styles */
    <Card
    as={Link} to={`/${id}`}
    className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
        <CardBody >
          <Stack gap={2} direction="vertical" className="justify-content-center align-items-center h-100">
            <CardTitle className="fw-normal fs-5">{title}</CardTitle>
            {tags.length > 0 && (
              <Stack gap={1} direction="horizontal" className="justify-content-center flex-wrap">
                {tags.map((tag) => (
                  <Badge key={tag.id} className="text-truncate">
                    {tag.label}
                  </Badge>
                ))}
              </Stack>
            )}
          </Stack>
        </CardBody>
      </Card>
  );
}
