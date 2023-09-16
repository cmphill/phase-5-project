import './Article.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import unstarred from '../assets/unstarred.png'
import starred from '../assets/starred.png'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Accordion from 'react-bootstrap/Accordion'
import {useAccordionButton} from 'react-bootstrap/AccordionButton'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import FormControl from 'react-bootstrap/FormControl'
import useStore from '../store'
import CaretIcon from '../assets/caret.svg'

function CustomToggle({ children, eventKey, setIsEditable, isEditable, className}) {
    const edit= useAccordionButton(eventKey, () => 
        setIsEditable(!setIsEditable)

    )
  
    return (
      <button
        className='edit-button'
        type="button"
        style={isEditable ? {backgroundColor: 'pink'} : {backgroundColor: 'blue'}}
        onClick={edit}

      >
        {children}
      </button>


    );
  }


  
function Article() {
    let { id } = useParams()
    let articleId = parseInt(id)
    const isEditable = useStore(state => state.isEditable)
    const setIsEditable = useStore(state => state.setIsEditable)
    const isFavoriteArticle = useStore(state => state.isFavoriteArticle)
    const toggleIsFavoriteArticle = useStore(state => state.toggleIsFavoriteArticle)
    const current_user = useStore(state => state.current_user)
    const addFavoriteArticle = useStore(state => state.addFavoriteArticle)
    const deleteFavoriteArticle = useStore(state => state.deleteFavoriteArticle)
    
    function userFavoriteArticle() {
        if (isFavoriteArticle !== true && current_user) {
            console.log(current_user, isFavoriteArticle, 'this is current user in add to favorites')
            fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    article_id: articleId,
                })
            })
            .then((res) => res.json())
            .then((newFavorite) => {
                addFavoriteArticle(newFavorite)
                toggleIsFavoriteArticle()
            })
        } if (isFavoriteArticle === true && current_user) {
            console.log(current_user, isFavoriteArticle, 'this is current user in remove from favorites')
            fetch(`/api/favorites/${articleId}`, {
                method: 'DELETE',
            }).then(() =>{ 
                deleteFavoriteArticle(articleId)
                toggleIsFavoriteArticle()
            })
        }
        else {
            console.log('you are not logged in')
        }
    }

    


  
    return (
        <Tabs >
                <Tab eventKey="article" title="Article">
                    <Card style={{width: '85vw', height: '75vh' }}>
                        {/* add note button to expand accordion element */}
                        <Card.Body>
                            <img className="article-image" src={'../src/assets/sunset.jpeg'} />
                            <Card.Title>Article Title</Card.Title>
                            <Card.Subtitle>Category Link</Card.Subtitle>
                            <Card.Text>Article Text</Card.Text>

                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>This is item 1</ListGroup.Item>
                                <ListGroup.Item>This is item 2</ListGroup.Item>
                                <ListGroup.Item>This is item 3</ListGroup.Item>
                                <ListGroup.Item>This is item 4</ListGroup.Item>
                            </ListGroup>
                            {/* Description space (expanding)
                            favorite button */}
                            <div className="button-container">
                                <Button size="sm" className='favorite-button' onClick={userFavoriteArticle}>
                                    {isFavoriteArticle ? <img className='favorite-img' src={starred} alt="Remove from favorites" /> : <img className='favorite-img' src={unstarred} alt="Add to favorites" />}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Tab>
                <Tab eventKey="notes" title="Notes">
                    <Card style={{width: '85vw', height: '75vh' }}>
                            {/* add note button to expand accordion element */}
                        <Card.Title>Article Title + 'Notes'</Card.Title>
                        <Accordion defaultActiveKey="0">
                            <Card>
                            
                                <Card.Header className="d-flex justify-content-between" >
                                    <CustomToggle eventKey="0" >{<img src={CaretIcon} alt="Caret Icon"/>}</CustomToggle>
                                    <CustomToggle className="ms-auto"  eventKey="0" setIsEditable={setIsEditable} isEditable={isEditable}>{isEditable? 'Save' : 'Edit'}</CustomToggle>
                                </Card.Header >
                               
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body style={{padding: 5, backgroundColor:'pink'}}>
                                        <FormControl
                                            as='textarea'
                                            plaintext
                                            rows={5}
                                            readOnly={!isEditable}
                                            placeholder='Enter your notes here...'
                                            style={{backgroundColor: '#b4b5b6', padding: 5}}
                                        />
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Card> 
                </Tab>
        </Tabs>
    )
}

export default Article