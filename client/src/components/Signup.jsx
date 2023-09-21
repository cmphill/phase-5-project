import { useNavigate, NavLink } from "react-router-dom"
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import useStore from "../store"
import * as yup from 'yup'
import {ref} from 'yup'
import * as formik from 'formik'

function Signup() {
    // const currentUser = useStore(state => state.current_user)
    const navigate = useNavigate()
    const setCurrentUser = useStore(state => state.setCurrentUser)
    const addSignupErrors = useStore(state => state.addSignupErrors)
    const clearSignupErrors = useStore(state => state.clearSignupErrors)
    const signupErrors = useStore(state => state.signupErrors)

    function handleSubmit(values) {
        clearSignupErrors()
        console.log(values)
        fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Invalid Signup')
            }
            return res.json()
        })
        .then(() => {
            setUser()
            navigate('/')
        })
        
        .catch(error => {
            console.error('server eror', error)
            addSignupErrors(error.message)
        })
    }

    function setUser() {
        fetch('/api/login') 
            .then (res => res.json())
            .then (user => setCurrentUser({
                id: user.id,
                username: user.username
            }))

        }



// .then(res => {
//     if (!res.ok) {
//         throw new Error('Network response was not ok');
//     }
//     return res.json();
//     .then(res => setCurrentUser(res))
    
//     .catch(error => console.error('There has been a problem with your fetch operation:', error));

    const { Formik } = formik;

    const formSchema = yup.object(). shape({
        username: yup
        .string()
        .transform(value => value.toLowerCase())
        .matches(/^[a-z0-9]*$/, 'Username may only contain letters and numbers')
        .required('Username is required'),
        password: yup.string().min(8, 'Requires minimum eight characters').max(20, 'Maximum 20 Characters Allowed.').required('<Please Enter a Valid Password>'),
        password_confirmation: yup.string().oneOf([ref("password")], "Passwords do not match.").required('<Must Match Password>')
    })


    return (
        <>
        <h1>Login</h1>
        <Formik 
            validationSchema={formSchema}
            onSubmit={handleSubmit}
            initialValues={{
                username: '',
                password: '',
                password_confirmation: '',
            }}
        >
        {({ handleSubmit, handleChange, handleBlur, values, touched, errors}) => (
            <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="validationFormik01">
                        <Form.Label>Username:  </Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.username && !errors.username}
                        />
                        {/* <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback> */}
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="validationFormik02">
                        <Form.Label>Password:  </Form.Label>
                        <Form.Control
                            type="text"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.password && !errors.password}
                        />
                        {/* <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback> */}
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="validationFormik03">
                        <Form.Label>Confirm Password:  </Form.Label>
                        <Form.Control
                            type="text"
                            name="password_confirmation"
                            value={values.password_confirmation}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.password_confirmation && !errors.password_confirmation}
                        />
                        {/* <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback> */}
                    </Form.Group>
                    <Button style={{marginTop: 20}} type="Submit">Sign Up</Button>
                </Row>
                <Row>
                {signupErrors && <p> {signupErrors} </p>}
                </Row>
            </Form>
        )}
        </Formik>
        </>
    )
}

export default Signup