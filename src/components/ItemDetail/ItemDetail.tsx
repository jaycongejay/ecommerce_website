import React, { useContext, useEffect, useState } from "react";
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
import {
	fireAddNewDoc,
	fireAuth,
	fireGetDoc,
	fireGetDocs,
	fireUpdateDoc,
} from "../../config/fire";
import { Timestamp } from "firebase/firestore";
import "./ItemDetail.scss";
import { ShoppingCartInfoContext } from "../ShoppingCartInfo/ShoppingCartInfo";

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
	const [toggleUserShoppingCart, setToggleUserShoppingCart] = useContext(
		ShoppingCartInfoContext
	);

	useEffect(() => {
		const update = { ...itemDetail };
		fireAuth.onAuthStateChanged((user) => {
			if (user) {
				update.user = user.email;
				// get an image
				fireGetDoc("images", match.params.id).then((doc) => {
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

	const toggle = () => {
		const update = { ...itemDetail };
		update.modal = !itemDetail.modal;

		// check if the item exist in user's shopping cart
		fireAuth.onAuthStateChanged((user) => {
			if (user) {
				fireGetDocs("shoppingCart").then((snap) => {
					snap.docs.some((doc) => {
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
			fireUpdateDoc("shoppingCart", itemDetail.shoppingCartId, {
				qty: itemDetail.qty,
			})
				.then(function () {
					console.log("User Setting Updated successfully");
				})
				.catch(function (error) {
					console.error("Error Updating document: ", error);
				});
		} else {
			// Create new item in shopping cart
			fireAddNewDoc("shoppingCart", {
				qty: itemDetail.qty,
				email: itemDetail.user,
				itemName: itemDetail.imageName,
				itemId: match.params.id,
				price: itemDetail.price,
				createdAt: Timestamp.now(),
			})
				.then(function () {
					console.log("A new item has been added successfully");
					setToggleUserShoppingCart(!toggleUserShoppingCart);
				})
				.catch(function (error) {
					console.error(error);
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
