import React, {Component} from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import {fire, timestamp} from '../../config/fire';
import './Login.scss';

class Login extends Component {

    constructor(props){
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.signup = this.signup.bind(this);
        this.state = {
            email : '',
            password : '',
            modal : false
        }
    }

    login(e){
        /* the default action that belongs to the event will not occur. 
         * Clicking on a "Submit" button, prevent it from submitting a form
         */
        e.preventDefault(); 
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(u =>  { 
            window.location.href='/'; // redirect to home page
        })
        .catch(err => { console.log(err)})
    }

    handleChange(e){

        this.setState({
            /* get value from user input and set it to email or password. 'e.target.name'
             * would be 'email' or 'password' which is the value of the name property of the input
             * like name='email' or name='password'
             */
            [e.target.name] : e.target.value 
        })
    }

    signup(e){
        e.preventDefault();

        fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(u => { 

            console.log(u)

            fire.firestore().collection("userSetting").add({
                address: "",
                createdAt: timestamp(),
                email: this.state.email,
                name: "",
                phone: ""
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });

            // Directly login as new user
            this.login(e);
        })
        .catch(err => { 
            this.toggle();
        })

    }
    
    toggle = () => {
        this.setState({modal: !this.state.modal});
    }

   

    render(){

        return( // all inside ( ) are javascript
            <>
            <Form className='loginForm'>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" placeholder="email@example.com" onChange={this.handleChange} defaultValue={this.state.email}/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
            
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Password" onChange={this.handleChange} defaultValue={this.state.password}/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={this.login}>
                    Login
                </Button>
                <Button variant="secondary" type="submit" onClick={this.signup}>
                    Signup
                </Button>
            </Form>

            {/* Error message for the user enter a existing email */}
            <Modal
            show={this.state.modal}
            onHide={this.toggle}
            backdrop="static"
            keyboard={false}
            >
            <Modal.Header closeButton>
            <Modal.Title>Hello customer!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            The user already exists.
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={this.toggle}>
                Close
            </Button>
            </Modal.Footer>
            </Modal>
            </>
        );
    }
}




// export the component above
export default Login;