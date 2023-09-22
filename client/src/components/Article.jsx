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
import NoteCard from './NoteCard'

import FormControl from "react-bootstrap/FormControl";
import useStore from "../store";
import Notes from './Notes'

const PINK = "rgba(255, 192, 203, 0.6)";
const BLUE = "rgba(0, 0, 255, 0.6)";



function Article() {
  let { id } = useParams();
  let articleId = parseInt(id);
  const { userNotes, setUserNotes} =
    useStore();
  const isFavoriteArticle = useStore((state) => state.isFavoriteArticle);
  const toggleIsFavoriteArticle = useStore(
    (state) => state.toggleIsFavoriteArticle
  );
  const current_user = useStore((state) => state.current_user);
 
  const addFavoriteArticle = useStore((state) => state.addFavoriteArticle);
  const deleteFavoriteArticle = useStore(
    (state) => state.deleteFavoriteArticle
  );

  const [articleData, setArticleData] = useState([]);

 




  useEffect(() => {
    console.log(id)
    fetch(`/api/article/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticleData(data);
        return articleData;
      });
  }, []);




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
            <div className ='article-text-content'>
            <Card.Text>{articleData.description} </Card.Text>

            <ListGroup className="list-group-flush">
              <ListGroup.Item>{articleData.key_facts}</ListGroup.Item>
              <ListGroup.Item>
                <a href={articleData.article_url}>Read on Wikipedia </a>
              </ListGroup.Item>
            </ListGroup>
            {/* Description space (expanding)
                            favorite button */}
            </div>
            <div className="button-container">
              <Button
                size="sm"
                className="favorite-button"
                onClick={() => {
                  console.log(articleId)
                  userFavoriteArticle(articleId)}}
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
            <span>Notes</span>
            <Button className="add-note">
              Add Note
            </Button>
          </Card.Title>
          </Card>
      </Tab>
    </Tabs>
  )

}
export default Article;
