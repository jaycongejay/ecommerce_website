import React, { useEffect, useState } from "react";
import { ModalFooter, Table } from "reactstrap";
import { converToHumanDate } from "./managementH";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import "./UsersInfo.scss";
import { fireAuth, fireDeleteDoc, fireGetDocs } from "../../config/fire";

const UsersInfo = () => {
	const [userInfos, setUserInfos] = useState<any[]>();
	const [allShoppingCarts, setAllShoppingCarts] = useState<any[]>();
	const [deleteModal, setDeleteModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState();

	useEffect(() => {
		getAllShoppingCarts();
		getAllUserInfos();
	}, [userInfos]);

	const getAllUserInfos = () => {
		fireAuth.onAuthStateChanged((user) => {
			if (user) {
				fireGetDocs("userSetting").then((snap) => {
					const users = [];
					snap.forEach((doc) => {
						users.push({ ...doc.data(), id: doc.id });
					});
					setUserInfos(users);
				});
			}
		});
	};
	const getAllShoppingCarts = () => {
		fireAuth.onAuthStateChanged((user) => {
			if (user) {
				fireGetDocs("shoppingCart").then((snap) => {
					const carts = [];
					snap.forEach((doc) => {
						carts.push({ ...doc.data(), id: doc.id });
					});
					setAllShoppingCarts(carts);
				});
			}
		});
	};

	const getUserShoppingCartNumOfItems = (userEmail: string) => {
		let userCartNumOfItems = 0;
		allShoppingCarts.forEach((cart) => {
			if (cart.email === userEmail) {
				userCartNumOfItems++;
			}
		});
		return userCartNumOfItems;
	};
	// Empty user's shopping cart
	const deleteUser = () => {
		// Clear the user's shopping cart
		allShoppingCarts.forEach((cart) => {
			if (cart.email === selectedUser) {
				fireDeleteDoc("shoppingCart", cart.id)
					.then(function () {
						console.log("Document successfully deleted!");
					})
					.catch(function (error) {
						console.error("Error removing document: ", error);
					});
			}
		});
		setDeleteModal(false);
	};

	const deleteModalToggle = () => {
		setDeleteModal(!deleteModal);
	};
	const deleteUserData = (userEmail) => {
		setSelectedUser(userEmail);
		setDeleteModal(true);
	};

	return (
		<div className="userInfo">
			<Table borderless>
				<thead>
					<tr>
						<th>#</th>
						<th>Email/User ID</th>
						<th>Name</th>
						<th>Phone</th>
						<th>Created</th>
						<th>Number of items in shopping cart</th>
						<th>Clear shopping cart</th>
					</tr>
				</thead>
				<tbody>
					{userInfos?.map((user, index) => (
						<tr key={index}>
							<th scope="row">{index + 1}</th>
							<td>{user.email}</td>
							<td>{user.name}</td>
							<td>{user.phone}</td>
							<td>{converToHumanDate(user.createdAt.seconds)}</td>
							<td>{getUserShoppingCartNumOfItems(user.email)}</td>
							<td>
								<span
									className="deleteBtn"
									onClick={() => deleteUserData(user.email)}
								>
									Delete
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
			<Modal isOpen={deleteModal} toggle={deleteModalToggle}>
				<ModalHeader toggle={deleteModalToggle}>Warning</ModalHeader>
				<ModalBody>The user's shopping cart will be cleared.</ModalBody>
				<ModalFooter>
					<Button
						color="dark"
						style={{ marginTop: "2rem" }}
						block
						onClick={deleteUser}
					>
						OK
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};

export default UsersInfo;
