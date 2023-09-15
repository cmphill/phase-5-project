import './Article.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import unstarred from '../assets/unstarred.png'
import starred from '../assets/starred.png'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import useStore from '../store'
import Accordion from 'react-bootstrap/Accordion'
import {useAccordionButton} from 'react-bootstrap/AccordionButton'
import { useState } from 'react'
import FormControl from 'react-bootstrap/FormControl'

function CustomToggle({ children, eventKey, setIsEditable}) {
    const edit= useAccordionButton(eventKey, () =>
      setIsEditable(isEditable => !isEditable)
    );
  
    return (
      <button
        className='edit-button'
        type="button"
        style={{ backgroundColor: 'pink' }}
        onClick={edit}
      >
        {children}
      </button>


    );
  }


  
function Article() {
    const [isEditable, setIsEditable] = useState(false)
    const [key, setKey] = useState('article')
    const isFavoriteArticle = useStore(state => state.isFavoriteArticle)
    const toggleIsFavoriteArticle = useStore(state => state.toggleIsFavoriteArticle)

  
    return (
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
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
                                <Button size="sm" className='favorite-button' onClick={toggleIsFavoriteArticle}>
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
                                <Card.Header /*className="d-flex justify-content-between"*/ >
                                    <Accordion.Header eventKey="0"> </Accordion.Header>
                                    <CustomToggle className="ms-auto"  eventKey="0" setIsEditable={setIsEditable}>Edit</CustomToggle>
                                </Card.Header >
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        <FormControl 
                                            as='textarea'
                                            plaintext
                                            rows={3}
                                            readOnly={false}
                                            defaultValue="Enter your note here"
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