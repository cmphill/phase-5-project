import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Placeholder from 'react-bootstrap/Placeholder'


function Article() {


    return (
        <Card style={{width: '85vw', height: '75vh' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <Card.Title>Article Title</Card.Title>
                <Card.Subtitle>Category Link</Card.Subtitle>
                <Card.Text>Article Text</Card.Text>

                <ListGroup className="list-group-flush">
                    <ListGroup.Item>This is item 1</ListGroup.Item>
                    <ListGroup.Item>This is item 2</ListGroup.Item>
                    <ListGroup.Item>This is item 3</ListGroup.Item>
                    <ListGroup.Item>This is item 4</ListGroup.Item>
                </ListGroup>

            </Card.Body>
        </Card>
    )
}

export default Article