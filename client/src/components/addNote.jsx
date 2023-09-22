import {useState} from 'react'

function addNote() {
    const [newNoteData, setNewNoteData] = useState({
      title: "",
      text: "",
    });
  
    const handleAddNote = async () => {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNoteData),
      });
  
      if (response.ok) {
        const newNote = await response.json();
        setAllNotes([...allNotes, newNote]);
        setNewNoteData({
          title: "",
          text: "",
        });
      } else {
        // Handle error
      }
    };
  
    return (
      <button onClick={handleAddNote}>Add Note</button>
    );
  }

  export default addNote