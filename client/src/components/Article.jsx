import "./Article.css";
import "bootstrap/dist/css/bootstrap.min.css";
import unstarred from "../assets/unstarred.png";
import starred from "../assets/starred.png";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";
import AccordionContext from "react-bootstrap/AccordionContext";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import caret from "../assets/caret.svg";
import save from "../assets/save.svg";
import edit from "../assets/edit.svg";
import trash from "../assets/trash.svg";

import FormControl from "react-bootstrap/FormControl";
import useStore from "../store";

const PINK = "rgba(255, 192, 203, 0.6)";
const BLUE = "rgba(0, 0, 255, 0.6)";

function Article() {
  const { id } = useParams();
  const articleId = parseInt(id);
  const { userNotes, setUserNotes, current_user, isEditable, addFavoriteArticle, deleteFavoriteArticle, toggleIsFavoriteArticle, isFavoriteArticle } = useStore();
  const [articleData, setArticleData] = useState([]);

  useEffect(() => {
    fetchArticleData();
    fetchUserNotes();
  }, [current_user]);

  const fetchArticleData = async () => {
    const res = await fetch(`/api/article/${id}`);
    const data = await res.json();
    setArticleData(data);
  };

  const fetchUserNotes = async () => {
    const user_id = 2;
    const res = await fetch(`/api/notes?user_id=${user_id}`);
    const data = await res.json();
    const noteKeys = data.map((note) => ({ ...note, eventKey: note.id }));
    setUserNotes(noteKeys);
  };

  const addNote = async () => {
    const newNote = { text: "", title: "", article_id: 1 };
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote)
    });
    const data = await res.json();
    const noteKeys = data.map((note) => ({ ...note, eventKey: note.id }));
    setUserNotes(noteKeys);
  };

  const userFavoriteArticle = async (articleId) => {
    if (isFavoriteArticle !== true && current_user) {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: articleId }),
      });
      if (res.ok) {
        const newFavorite = await res.json();
        addFavoriteArticle(newFavorite);
        toggleIsFavoriteArticle();
      } else {
        const errors = await res.json();
        console.log("we've sprung an error");
        console.log(errors);
      }
    } else if (isFavoriteArticle === true && current_user) {
      const favorite = useStore.getState().favoriteArticles.find((favorite) => favorite.article_id === articleId);
      if (favorite) {
        await fetch(`/api/favorites/${favorite.id}`, { method: "DELETE" });
        deleteFavoriteArticle(favorite.id);
        toggleIsFavoriteArticle();
      }
    } else {
      console.log("you are not logged in");
    }
  };

  return (
    <Tabs>
      <Tab eventKey="article" title="Article">
        <ArticleCard articleData={articleData} userFavoriteArticle={userFavoriteArticle} isFavoriteArticle={isFavoriteArticle} />
      </Tab>
      <Tab eventKey="notes" title="Notes">
        <NotesCard userNotes={userNotes} addNote={addNote} />
      </Tab>
    </Tabs>
  );
}

const ArticleCard = ({ articleData, userFavoriteArticle, isFavoriteArticle }) => (
  <Card style={{ width: "85vw", height: "75vh" }}>
    <Card.Body>
      <img className="article-image" src={articleData.image_url} />
      <Card.Title>{articleData.title}</Card.Title>
      <Card.Subtitle>{articleData.category}</Card.Subtitle>
      <Card.Text>{articleData.description} </Card.Text>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>{articleData.key_facts}</ListGroup.Item>
        <ListGroup.Item>
          <a href={articleData.article_url}>Read on Wikipedia </a>
        </ListGroup.Item>
      </ListGroup>
      <div className="button-container">
        <Button size="sm" className="favorite-button" onClick={() => userFavoriteArticle(articleId)}>
          {isFavoriteArticle ? (
            <img className="favorite-img" src={starred} alt="Remove from favorites" />
          ) : (
            <img className="favorite-img" src={unstarred} alt="Add to favorites" />
          )}
        </Button>
      </div>
    </Card.Body>
  </Card>
);
const NoteCard = ({ note }) => {
  const { isEditable, setIsEditable } = useStore();
  const activeEventKey = useContext(AccordionContext);

  const handleSaveEditClick = () => {
    if (isEditable) {
      const updatedNote = {
        text: note.text,
        title: note.title,
      };
      patchNote(updatedNote);
      setIsEditable(false);
    } else {
      setIsEditable(true);
    }
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between">
        <ContextToggle eventKey={note.eventKey} note={note}>
          <img src={caret} />
        </ContextToggle>
      </Card.Header>
      <Accordion.Collapse eventKey={note.eventKey}>
        <Card.Body style={{ padding: 5, backgroundColor: "pink" }}>
          <FormControl
            className="note-title"
            as="textarea"
            plaintext
            readOnly={!isEditable}
            placeholder="Enter your title here..."
            text={note.title}
            rows={1}
            style={{ backgroundColor: "#b4b5b6", padding: 5 }}
          />
          <FormControl
            className="note-text"
            as="textarea"
            plaintext
            rows={5}
            readOnly={!isEditable}
            placeholder="Enter your notes here..."
            text={note.text}
            style={{ backgroundColor: "#b4b5b6", padding: 5 }}
          />
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};
const ContextToggle = ({ children, eventKey, note }) => {
  const { currentEventKey, setCurrentEventKey, isEditable, setIsEditable } = useStore();
  const activeEventKey = useContext(AccordionContext);
  const isCurrentEventKey = activeEventKey === eventKey;

  const decoratedOnClick = useAccordionButton(eventKey, () => {
    setCurrentEventKey(eventKey);
    setIsEditable(false);
  });

  const handleSaveEditClick = () => {
    if (isEditable) {
      const updatedNote = {
        text: note.text,
        title: note.title,
      };
      patchNote(updatedNote);
      setIsEditable(false);
    } else {
      setIsEditable(true);
    }
  };

  return (
    <div className="d-flex">
      <button
        type="button"
        style={{ backgroundColor: isCurrentEventKey ? PINK : BLUE }}
        onClick={decoratedOnClick}
        eventKey={eventKey}
      >
        {children}
      </button>
      {isCurrentEventKey && (
        <div className="edit-save-trash-container">
          <button
            className="edit-save-trash"
            onClick={handleSaveEditClick}
          >
            {isEditable ? <img src={save} /> : <img src={edit} />}
          </button>
          <button onClick={() => deleteNote(note)} className="edit-save-trash">
            <img src={trash} />
          </button>
        </div>
      )}
    </div>
  );
};

const NotesCard = ({ userNotes, addNote }) => (
  <Card className="notes-parent-card" style={{ width: "85vw" }}>
    <Card.Title className="card-title">
      <span>Article Title + 'Notes'</span>
      <Button onClick={addNote} className="add-note">Add Note</Button>
    </Card.Title>
    <Accordion activeEventKey={activeEventKey}>
      {userNotes.map((note) => <NoteCard key={note.id} note={note} />)}
    </Accordion>
  </Card>
);

export default Article;
