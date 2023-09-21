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
  let { id } = useParams();
  let articleId = parseInt(id);
  const { userNotes, setUserNotes} =
    useStore();
  const { activeEventKey } = useContext(AccordionContext);
  const isFavoriteArticle = useStore((state) => state.isFavoriteArticle);
  const toggleIsFavoriteArticle = useStore(
    (state) => state.toggleIsFavoriteArticle
  );
  const current_user = useStore((state) => state.current_user);
  const { isEditable } = useStore();
  const addFavoriteArticle = useStore((state) => state.addFavoriteArticle);
  const deleteFavoriteArticle = useStore(
    (state) => state.deleteFavoriteArticle
  );

  const [articleData, setArticleData] = useState([]);


  function NoteCard({note}) {
    const eventKey = note.eventKey
    console.log(eventKey)
    console.log(note)
    return (
      <Card>
        <Card.Header className="d-flex justify-content-between">
          <ContextToggle eventKey={eventKey} note={note} >
            <img src={caret} />
          </ContextToggle>
        </Card.Header>

        <Accordion.Collapse eventKey={eventKey}>
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
  }

  useEffect(() => {
    console.log(id)
    fetch(`/api/article/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticleData(data);
        return articleData;
      });
  }, []);

  useEffect(() => {
    // const user_id = (useStore.getState().current_user.id)
    const user_id = 2
    console.log(user_id)
    fetch(`/api/notes?user_id=${user_id}`)
      .then((res) => res.json())
      .then(data => {
        const noteKeys = data.map((note) => ({
            ...note,
            eventKey: note.id
        }))
        console.log(noteKeys)
        noteKeys.forEach(note => {setUserNotes(note)})
        console.log(note)
        
        // data.forEach((note) => setUserNotes(note))
      });
  }, [current_user]);


  function addNote() {
    const newNote = ({
      text: "",
      title: "",
      article_id: 1,
    });
    fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
    })
    .then(res => res.json())
    .then(data => {
        noteKeys = data.map((note) => ({
            ...note,
            eventKey: note.id
        }))
        setUserNotes(noteKeys)
    })
  }

  function userFavoriteArticle(articleId) {
    if (isFavoriteArticle !== true && current_user) {
      console.log(
        current_user,
        isFavoriteArticle,
        "this is current user in add to favorites"
      );

      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: articleId,
        }),
      }).then((res) => {
        if (res.ok) {
          res.json().then((newFavorite) => {
            console.log("Response from server:", newFavorite);
            addFavoriteArticle(newFavorite);
            toggleIsFavoriteArticle();
          });
        } else {
          res.json().then((errors) => {
            console.log("we've sprung an error");
            console.log(errors);
          });
        }
      });
    } else if (isFavoriteArticle === true && current_user) {
      console.log(current_user);
      console.log(useStore.getState().favoriteArticles);
      const favorite = useStore
        .getState()
        .favoriteArticles.find((favorite) => favorite.article_id === articleId);
      console.log(favorite);
      if (favorite) {
        fetch(`/api/favorites/${favorite.id}`, {
          method: "DELETE",
        }).then(() => {
          deleteFavoriteArticle(favorite.id),
            toggleIsFavoriteArticle(),
            console.log("we got this far");
        });
      }
    } else {
      console.log("you are not logged in");
    }
  }

  return (
    <Tabs>
      <Tab eventKey="article" title="Article">
        <Card style={{ width: "85vw", height: "75vh" }}>
          {/* add note button to expand accordion element */}
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
            {/* Description space (expanding)
                            favorite button */}
            <div className="button-container">
              <Button
                size="sm"
                className="favorite-button"
                onClick={() => userFavoriteArticle(articleId)}
              >
                {isFavoriteArticle ? (
                  <img
                    className="favorite-img"
                    src={starred}
                    alt="Remove from favorites"
                  />
                ) : (
                  <img
                    className="favorite-img"
                    src={unstarred}
                    alt="Add to favorites"
                  />
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Tab>
      <Tab eventKey="notes" title="Notes">
        <Card className="notes-parent-card" style={{ width: "85vw" }}>
          <Card.Title className="card-title">
            <span>Article Title + 'Notes'</span>
            <Button onClick={addNote} className="add-note">
             
              Add Note
            </Button>
          </Card.Title>

          <Accordion activeEventKey={activeEventKey}>
            {userNotes.map((note) =>(
               <NoteCard eventKey={note.id} note={note}/>))}
          </Accordion>
        </Card>
      </Tab>
    </Tabs>
  );
}
function ContextToggle({ children, eventKey, note }) {
    const activeEventKey  = useContext(AccordionContext);
    const { currentEventKey, setCurrentEventKey, isEditable, setIsEditable } = useStore();
    console.log(eventKey)
    
    const decoratedOnClick = useAccordionButton(eventKey, () => {
      console.log(eventKey)
      setCurrentEventKey(eventKey);
      console.log(currentEventKey);
      setIsEditable()
    });
  
  
   

    console.log(note.eventKey)
    console.log(activeEventKey)

    
  
    function patchNote(eventKey, updatedNote) {
      console.log(eventKey)
      fetch(`/api/notes/${eventKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failied to patch notes");
          }
          return res.json();
        })
        .then(() => {
          setUserNotes(notes => notes.map(note => note.id === eventKey ? updatedNote : note));
        })
        .catch((error) => {
          console.error("server error", error);
        });
    }
  
    function deleteNote(note) {
        
      console.log(note.eventKey, 'delete note now')
      console.log()
      fetch(`/api/notes/${eventKey}`, {
          method: 'DELETE',
      })
      .then((res) => {
          if (!res.ok) {
              throw new Error("Failed to delete. Please try again later")
           }
           return {'' : ''}, 204
          })     
      }
  
    function handleSaveEditClick(isEditable) {
        console.log(note.eventKey, 'in iseditable')
      if (isEditable) {
        const updatedNote = {
          text: note.text,
          title: note.title,
        };
        patchNote(updatedNote);
        setIsEditable();
      } else {
        setIsEditable();
      }
    }
  
    return (
      <div className="d-flex">
        <button
          type="button"
          style={{ backgroundColor: isCurrentEventKey ? PINK : BLUE }}
          onClick={() => decoratedOnClick(note.eventKey) }
          eventKey={eventKey}
        >
          {children}
        </button>
        {isCurrentEventKey && (
          <div className="edit-save-trash-container">
            <button
              className="edit-save-trash"
              onClick={() => handleSaveEditClick(note, isEditable)}
              
            >
              {isEditable ? <img src={save} /> : <img src={edit} />}
            </button>
            <button  onClick={() => deleteNote(note)} className="edit-save-trash">
              <img src={trash} />
            </button>
          </div>
        )}
      </div>
    );
  }

export default Article;
