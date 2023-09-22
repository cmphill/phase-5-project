import { useState, useEffect } from "react";
import useStore from "../store";
import NoteCard from "./NoteCard";
import Accordion from "react-bootstrap/Accordion";
import "bootstrap/dist/css/bootstrap.min.css";

function Notes() {
  const current_user = 1;
  const [allNotes, setAllNotes] = useState(null);
  const [newNoteTitle, setNewNoteTitle] = useState(null);
  const [newNoteText, setNewNoteText] = useState(null);

  useEffect(() => {
    console.log(current_user);
    fetch(`/api/notes?user_id=${current_user}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("error retrieving notes");
        }
        return res.json();
      })
      .then((data) => {
        setAllNotes(data);
      });
  }, []);

  const handleAddNote = () => {
    const response = fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newNoteTitle,
        text: newNoteText,
      }),
    });

    if (response.ok) {
      const newNote = response.json();
      setAllNotes([...allNotes, newNote]);
      setNewTitle("");
      setNewText("");
    } else {
      // Handle error
    }
  };

  return (
    <>
      <button onClick={handleAddNote}> Add Note</button>
      <input
        type="text"
        value={newNoteTitle}
        onChange={(e) => setNewNoteTitle(e.target.value)}
      />
      <input
        type="text"
        value={newNoteText}
        onChange={(e) => setNewNoteText(e.target.value)}
      />
      <Accordion>
        {allNotes &&
          allNotes.map((note) => <NoteCard key={note.id} data={note} />)}
        {/* {allNotes.map((note) => (<NoteCard key={note.id} data={note}/>))} */}
      </Accordion>
    </>
  );
}

export default Notes;
