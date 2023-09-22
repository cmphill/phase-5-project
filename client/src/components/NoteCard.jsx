import { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import FormControl from "react-bootstrap/FormControl";

const NoteCard = ({ data }) => {
  const [title, setTitle] = useState(data.title);
  const [text, setText] = useState(data.text);
  const [isEditable, setIsEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  function handleDelete() {
    fetch(`/api/notes/${data.id}`, {
      method: "DELETE",
    });
  }

  function handleEdit() {
    if (isEditing) {
      setIsEditing(false);
      handlePatching();
    } else {
      setIsEditing(true);
    }
    // if (!isEditable) {
    //   setIsEditable(true);
    // }
    // else {
    //    setIsEditable(false);
    //   setTitle(data.title);
    //   setText(data.text);
    //   fetch(`/api/notes/${data.id}`, {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       text: text,
    //       title: title,
    //     }),
    //   })
    //     .then((res) => {
    //       if (!res.ok) {
    //         throw new Error("error");
    //       }
    //       return res.json();
    //     })
    //     // .then(() => {
    //     //     setUserNotes(notes => notes.map(note => note.id === note.id ? updatedNote : note))
    //     // })
    //     .catch((error) => {
    //       console.error("server error", error);
    //     });
    // }
  }

  function handlePatching() {
    fetch(`/api/notes/${data.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
        title: title,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("error");
        }
        return res.json();
      })
      // .then(() => {
      //     setUserNotes(notes => notes.map(note => note.id === note.id ? updatedNote : note))
      // })
      .catch((error) => {
        console.error("server error", error);
      });
  }

  return (
    <Accordion.Item eventKey={data.id}>
      <Accordion.Header>Note</Accordion.Header>
      <Accordion.Body>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleEdit}>{isEditing ? "Save" : "Edit"}</button>
        {!isEditing ? (
          <div>
            <p>{title}</p>
            <p>{text}</p>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        )}
        {/* <FormControl
          className="note-title"
          as="textarea"
          plaintext
          readOnly={!isEditable}
          placeholder="title"
        >
          {data.title}
        </FormControl>
        <FormControl
          className="note-text"
          as="textarea"
          plaintext
          readOnly={!isEditable}
          placeholder="notes"
          text={data.text}
        >
          
        </FormControl> */}
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default NoteCard;
