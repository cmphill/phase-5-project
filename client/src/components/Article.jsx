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
import AccordionContext from 'react-bootstrap/AccordionContext'
import {useAccordionButton} from 'react-bootstrap/AccordionButton'
import { useEffect, useState, useContext } from 'react'
import {useParams} from 'react-router-dom'

import FormControl from 'react-bootstrap/FormControl'
import useStore from '../store'

const PINK = 'rgba(255, 192, 203, 0.6)';
const BLUE = 'rgba(0, 0, 255, 0.6)';

function ContextToggle({children, eventKey, callback}) {
    const {activeEventKey} = useContext(AccordionContext)
        
    const decoratedOnClick = useAccordionButton(
        eventKey,
        () => callback && callback(eventKey),
    )

    const isCurrentEventKey = activeEventKey === eventKey


return (
    <button
    type="button"
    style={{ backgroundColor: isCurrentEventKey ? PINK : BLUE }}
    onClick={decoratedOnClick} >
        {children}
    </button>
)

} 
function Article() {

    let { id } = useParams()
    let articleId = parseInt(id)
    const isEditable = useStore(state => state.isEditable)
   
    const isFavoriteArticle = useStore(state => state.isFavoriteArticle)
    const toggleIsFavoriteArticle = useStore(state => state.toggleIsFavoriteArticle)
    const current_user = useStore(state => state.current_user)
    const addFavoriteArticle = useStore(state => state.addFavoriteArticle)
    const deleteFavoriteArticle = useStore(state => state.deleteFavoriteArticle)
    const [activeKey, setActiveKey] = useState(3)
    console.log(activeKey)

    const [articleData, setArticleData] = useState([])

    useEffect(() => {
        fetch('/api/article/1')
            .then(res => res.json())
            .then(data => {
                setArticleData(data)
                console.log(articleData)
                return articleData
            })
    
    }, [])

    
    
    function userFavoriteArticle(articleId) {
        if (isFavoriteArticle !== true && current_user) {
            console.log(current_user, isFavoriteArticle, 'this is current user in add to favorites')
            
            fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    article_id: articleId,
                })
            })
            .then((res) => {
                if (res.ok) {
                    res.json().then(newFavorite => {
                        console.log('Response from server:', newFavorite);
                        addFavoriteArticle(newFavorite)
                        toggleIsFavoriteArticle()
                    })
                    }
                
                else {
                    res.json().then(errors => {
                        console.log('we\'ve sprung an error')
                        console.log(errors)
                     })
                 }
            })
        } else if (isFavoriteArticle === true && current_user) {
            console.log(current_user)
            console.log(useStore.getState().favoriteArticles)
            const favorite = useStore.getState().favoriteArticles.find(favorite => favorite.article_id === articleId)
            console.log(favorite)
            if (favorite) {
            fetch(`/api/favorites/${favorite.id}`, {
                method: 'DELETE',
            }).then(() =>{ 
                deleteFavoriteArticle(favorite.id),
                toggleIsFavoriteArticle(),
                console.log('we got this far')
            })
            }
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
                            <img className="article-image" src={articleData.image_url} />
                            <Card.Title>{articleData.title}</Card.Title>
                            <Card.Subtitle>{articleData.category}</Card.Subtitle>
                            <Card.Text>{articleData.description} </Card.Text>

                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>{articleData.key_facts}</ListGroup.Item>
                                <ListGroup.Item><a href={articleData.article_url}>Read on Wikipedia </a></ListGroup.Item>
                            </ListGroup>
                            {/* Description space (expanding)
                            favorite button */}
                            <div className="button-container">
                                <Button size="sm" className='favorite-button' onClick={() => userFavoriteArticle(articleId)}>
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
                        <Accordion activeKey={activeKey}>
                            
                            <Card>
                            
                                <Card.Header className="d-flex justify-content-between" >
                                    <ContextToggle eventKey="0" callback={callback}>buttontext</ContextToggle>
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