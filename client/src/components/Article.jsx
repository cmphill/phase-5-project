import './Article.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import unstarred from '../assets/unstarred.png'
import starred from '../assets/starred.png'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Nav from 'react-bootstrap/Nav'
import useStore from '../store'


function Article() {

    const isFavoriteArticle = useStore(state => state.isFavoriteArticle)
    const toggleIsFavoriteArticle = useStore(state => state.toggleIsFavoriteArticle)

  
    return (
        <div >
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
                        {isFavoriteArticle ? <img className='favorite-img' src={starred} alt="Remove from favorites" /> : <img className='favorite-image' src={unstarred} alt="Add to favorites" />}
                    </Button>
                </div>
            </Card.Body>
        </Card>
        </div>
    )
}

export default Article