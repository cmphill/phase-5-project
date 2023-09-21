import { useNavigate, NavLink } from "react-router-dom"
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import useStore from "../store"
import * as yup from 'yup'
import * as formik from 'formik'
import { useEffect } from 'react'

function Login() {
    // const currentUser = useStore(state => state.current_user)
    const navigate = useNavigate()
    const current_user = useStore(state => state.current_user)
    const setCurrentUser = useStore(state => state.setCurrentUser)
    const addLoginErrors = useStore(state => state.addLoginErrors)
    const clearLoginErrors = useStore(state => state.clearLoginErrors)
    const loginErrors = useStore(state => state.loginErrors)
    
    useEffect(() => {
        console.log(current_user, 'this is my use Effect')
    }, [current_user])
    
    function handleSubmit(values) {
        clearLoginErrors()
        console.log(values)
        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Invalid Credentials')
            }
            return res.json()
        })
        .then(()=> {
            setUser();
            navigate('/')
        })
        
        .catch(error => {
            console.error('server eror', error)
            addLoginErrors(error.message)
        })
    }
    function setUser() {
        fetch('/api/login') 
            .then (res => res.json())
            .then (user => {setCurrentUser({
                id: user.id,
                username: user.username,
            }),
            console.log(useStore.getState().current_user.id)
        })}
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
        password: yup
        .string()
        .required('Password is required')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, a number, and be at least 8 characters long')
    })


    return (
        <>
        <h1>Login</h1>
        <Formik 
            validationSchema={formSchema}
            onSubmit={handleSubmit}
            initialValues={{
                username: '',
                password: ''
            }}
        >
        {({ handleSubmit, handleBlur, handleChange, values, touched, errors}) => (
            <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col}  controlId="validationFormik01">
                        <Form.Label>Username:  </Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.username && !errors.username}
                            isInvalid={touched.username && !!errors.username}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {errors.username}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback >Looks good!</Form.Control.Feedback>
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
                            isInvalid={touched.password && !!errors.password}

                        />
                        <Form.Control.Feedback type='invalid'>
                            {errors.password}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback >Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit">Login</Button>
                </Row>
                <Row>
                    <Form.Text className="text-muted"> Not signed up yet? <NavLink to="../signup">Sign Up!</NavLink> </Form.Text>
                </Row>
                <Row>
                {loginErrors && <p> {loginErrors} </p>}
               </Row>
            </Form>
        )}
        </Formik>
        </>
    )
}

export default Login