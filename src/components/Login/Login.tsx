import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
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
import {
	fireAddNewDoc,
	fireAuth,
	fireCreateUser,
	fireSignIn,
} from "../../config/fire";
import { Timestamp } from "firebase/firestore";
import "./Login.scss";
import xss from "xss";

const Login = (props) => {
	const [loginState, setLoginState] = useState({
		email: "toyshop@shopping.com",
		password: "123456",
	});
	const [modal, setModal] = useState(false);
	const [errMessage, setErrMessage] = useState("");

	const login = (e) => {
		e.preventDefault();

		fireSignIn(fireAuth, loginState.email, loginState.password)
			.then((u) => {
				window.location.href = "/";
			})
			.catch((err) => {
				if (err.code === "auth/wrong-password") {
					setErrMessage(
						"The password you entered is incorrect. Please try again"
					);
				}
				if (err.code === "auth/user-not-found") {
					setErrMessage("Couldn't find your Toy Shop account");
				}
				setModal(true);
			});
	};

	const handleChange = (e) => {
		const update = { ...loginState };
		update[e.target.name] = xss(e.target.value);
		setLoginState(update);
	};

	const signup = (e) => {
		e.preventDefault();
		createUserFirebase()
			.then((u) => {
				fireAddNewDoc("userSetting", {
					address: "",
					createdAt: Timestamp.now(),
					email: loginState.email,
					name: "",
					phone: "",
				})
					.then(function () {
						console.log(
							"A user setting has been successfully added"
						);
					})
					.catch(function (error) {
						console.error(error);
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
		return await fireCreateUser(
			fireAuth,
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
				<FormGroup controlid="formBasicEmail">
					<Label>Email address</Label>
					<Input
						type="email"
						name="email"
						placeholder="email@example.com"
						onChange={handleChange}
						defaultValue={loginState.email}
					/>
				</FormGroup>

				<FormGroup controlid="formBasicPassword">
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
