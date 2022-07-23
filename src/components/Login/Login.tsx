import firebase from "firebase";
import React, { useState } from "react";
import {
	Button,
	Form,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from "reactstrap";
import { fire } from "../../config/fire";
import "./Login.scss";

const Login = (props) => {
	const [loginState, setLoginState] = useState({
		email: "toyshop@shopping.com",
		password: "123456",
	});
	const [modal, setModal] = useState(false);
	const [errMessage, setErrMessage] = useState("");

	const login = (e) => {
		e.preventDefault();

		fire.auth()
			.signInWithEmailAndPassword(loginState.email, loginState.password)
			.then((u) => {
				window.location.href = "/";
			})
			.catch((err) => {
				setErrMessage(err.message);
				setModal(true);
			});
	};

	const handleChange = (e) => {
		const update = { ...loginState };
		update[e.target.name] = e.target.value;
		setLoginState(update);
	};

	const signup = (e) => {
		e.preventDefault();
		createUserFirebase()
			.then((u) => {
				fire.firestore()
					.collection("userSetting")
					.add({
						address: "",
						createdAt: firebase.firestore.Timestamp.now(),
						email: loginState.email,
						name: "",
						phone: "",
					})
					.then(function (docRef) {
						console.log("Document written with ID: ", docRef.id);
					})
					.catch(function (error) {
						console.error("err");
					});

				// Login as new user
				login(e);
			})
			.catch((err) => {
				setErrMessage("The user already exists.");
				setModal(true);
			});
	};

	const createUserFirebase = async () => {
		return await fire
			.auth()
			.createUserWithEmailAndPassword(
				loginState.email,
				loginState.password
			);
	};

	const toggle = () => {
		setModal(!modal);
	};

	return (
		<>
			<Form className="loginForm">
				<FormGroup controlId="formBasicEmail">
					<Label>Email address</Label>
					<Input
						type="email"
						name="email"
						placeholder="email@example.com"
						onChange={handleChange}
						defaultValue={loginState.email}
					/>
				</FormGroup>

				<FormGroup controlId="formBasicPassword">
					<Label>Password</Label>
					<Input
						type="password"
						name="password"
						placeholder="Password"
						onChange={handleChange}
						defaultValue={loginState.password}
					/>
				</FormGroup>
				<Button variant="primary" type="submit" onClick={login}>
					Login
				</Button>
				<Button variant="secondary" type="submit" onClick={signup}>
					Signup
				</Button>
			</Form>

			{/* Error message for invalid login */}
			<Modal isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle}>Hello customer!</ModalHeader>
				<ModalBody>{errMessage}</ModalBody>
				<ModalFooter>
					<Button variant="secondary" onClick={toggle}>
						Close
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
};

export default Login;
