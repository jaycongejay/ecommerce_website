import firebase from "firebase";
import React, { useEffect, useState } from "react";
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	FormGroup,
	Input,
} from "reactstrap";
import { PRICE_TAG } from "../../assets/priceTag";
import { fire } from "../../config/fire";
import "./ItemDetail.scss";

const ItemDetail = (props) => {
	const { match } = props;
	const [itemDetail, setItemDetail] = useState({
		url: undefined,
		imageName: undefined,
		modal: false,
		qty: 1,
		price: 0,
		user: undefined,
		isItemExistInCart: false,
		shoppingCartId: undefined,
	});

	useEffect(() => {
		const update = { ...itemDetail };
		fire.auth().onAuthStateChanged((user) => {
			if (user) {
				update.user = user.email;
				// get an image
				getImagesFireStore(match.params.id).then((doc) => {
					if (doc.exists) {
						update.url = doc.data().url;
						update.imageName = doc.data().imageName;
						update.price = doc.data().price;
						setItemDetail(update);
					}
				});
			}
		});
	}, []);

	const getImagesFireStore = async (selectedId: string) => {
		return await fire
			.firestore()
			.collection("images")
			.doc(selectedId)
			.get();
	};

	const toggle = () => {
		const update = { ...itemDetail };
		update.modal = !itemDetail.modal;

		// check if the item exist in user's shopping cart
		fire.auth().onAuthStateChanged((user) => {
			if (user) {
				fire.firestore()
					.collection("shoppingCart")
					.orderBy("createdAt", "desc")
					.onSnapshot((snap) => {
						snap.forEach((doc) => {
							if (
								doc.data().email === user.email &&
								doc.data().itemId === match.params.id
							) {
								update.isItemExistInCart = true;
								update.shoppingCartId = doc.id;
							}
						});
					});
			}
		});
		setItemDetail(update);
	};

	const onSubmit = (e) => {
		e.preventDefault();

		if (itemDetail.isItemExistInCart) {
			// Update the existing item in shopping cart
			fire.firestore()
				.collection("shoppingCart")
				.doc(itemDetail.shoppingCartId)
				.update({
					qty: itemDetail.qty,
				})
				.then(function (docRef) {
					console.log("User Setting Updated successfully");
				})
				.catch(function (error) {
					console.error("Error Updating document: ", error);
				});
		} else {
			// Create new item in shopping cart
			fire.firestore()
				.collection("shoppingCart")
				.add({
					qty: itemDetail.qty,
					email: itemDetail.user,
					itemName: itemDetail.imageName,
					itemId: match.params.id,
					price: itemDetail.price,
					createdAt: firebase.firestore.Timestamp.now(),
				})
				.then(function (docRef) {
					console.log("Document written with ID: ", docRef.id);
				})
				.catch(function (error) {
					console.error("Error adding document: ", error);
				});
		}

		toggle();
	};

	const onChange = (e) => {
		const update = { ...itemDetail };
		if (e.target.value < 1) {
			update[e.target.name] = 1;
		} else {
			update[e.target.name] = e.target.value;
		}
		setItemDetail(update);
	};

	return (
		<div className="item_detail">
			<div className="img_container">
				<img src={itemDetail.url} alt={itemDetail.url} />
			</div>
			<div className="description">
				<div className="img_action">
					<div>
						<h5>{itemDetail.imageName}</h5>
					</div>
					<div>
						<h5>
							{PRICE_TAG(30)} ${itemDetail.price}
						</h5>
					</div>
					<div>
						<h5 className="addToCart" onClick={toggle}>
							ADD TO CART
						</h5>
					</div>
				</div>
			</div>

			<Modal isOpen={itemDetail.modal} toggle={toggle}>
				<ModalHeader toggle={toggle}>Add to Shopping Cart</ModalHeader>
				<ModalBody>
					<Form onSubmit={onSubmit}>
						<FormGroup>
							<Input
								type="number"
								name="qty"
								id="item"
								defaultValue={1}
								value={itemDetail.qty}
								onChange={onChange}
							/>
							<Button
								color="dark"
								style={{ marginTop: "2rem" }}
								block
							>
								OK
							</Button>
						</FormGroup>
					</Form>
				</ModalBody>
			</Modal>
		</div>
	);
};

export default ItemDetail;
