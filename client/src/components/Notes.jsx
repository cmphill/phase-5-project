import {useState, useEffect} from 'react'
import useStore from "../store"
import NoteCard from './NoteCard'
import Accordion from 'react-bootstrap/Accordion'
import 'bootstrap/dist/css/bootstrap.min.css'

function Notes() {
    const [allNotes, setAllNotes] = useState(null)
    const current_user = 1

    useEffect(() => {
        console.log(current_user)
        fetch(`/api/notes?user_id=${current_user}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error('error retrieving notes')
            }
            return res.json()
        })
        .then ((data) => {
            setAllNotes(data)
        })
    }, [])

    return (
        <Accordion>
             {allNotes && allNotes.map((note) => (<NoteCard key={note.id} data={note}/>))}
            {/* {allNotes.map((note) => (<NoteCard key={note.id} data={note}/>))} */}
        </Accordion>
    )
}

export default Notes