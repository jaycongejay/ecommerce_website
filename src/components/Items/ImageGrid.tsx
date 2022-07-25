import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	fireAddNewDoc,
	fireAuth,
	fireGetDoc,
	fireGetDocs,
	fireUpdateDoc,
} from "../../config/fire";
import "firebase/compat/firestore";
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	FormGroup,
	Input,
} from "reactstrap";
import { motion } from "framer-motion";
import "./ImageGrid.scss";
import { AuthContext } from "../Auth/AuthContext";
import { Tooltip } from "@material-ui/core";
import Loader from "../loader/loader";
import ErrorPage from "../ErrorPage/errorPage";
import { Product } from "./ItemF";
import { Timestamp } from "firebase/firestore";
import { ShoppingCartInfoContext } from "../ShoppingCartInfo/ShoppingCartInfo";
import NotificationMui from "../Notification/notification";

interface ImageGridProps {
	search?: string;
}

const ImageGrid = (props: ImageGridProps) => {
	const { search } = props;
	const [docs, setDocs] = useState<any[]>();
	const [items, setItems] = useState<Product>({
		products: undefined,
		totalNumOfProducts: 0,
	});
	const [isItemExistInCart, setIsItemExistInCart] = useState(false);
	const [shoppingCartId, setShoppingCartId] = useState(null);
	const [qty, setQty] = useState(1);
	const [email, setEmail] = useState("");
	const [imageName, setImageName] = useState("");
	const [price, setPrice] = useState(0);
	const [modal_item, setModal_item] = useState(false);
	const [imageId, setImageId] = useState(null);
	const [noticeEditShopCart, setNoticeEditShopCart] = useState(false);
	const [user, setUser] = useContext(AuthContext);
	const [toggleUserShoppingCart, setToggleUserShoppingCart] = useContext(
		ShoppingCartInfoContext
	);

	useEffect(() => {
		fireGetDocs("images").then((snap) => {
			let documents = [];
			snap.forEach((doc) => {
				documents.push({ ...doc.data(), id: doc.id });
			});
			setDocs(documents);
		});
	}, []);

	useEffect(() => {
		if (search && search !== "" && docs) {
			const filteredDocsBySearch = docs.filter((doc) =>
				doc.imageName.toLowerCase().includes(search.toLowerCase())
			);
			setItems({
				products: filteredDocsBySearch,
				totalNumOfProducts: docs.length,
			});
		} else {
			setItems({ products: docs, totalNumOfProducts: docs?.length });
		}
	}, [docs, search]);

	// Add or Edit item to Shopping cart
	const editCartItem = (imageId) => {
		setModal_item(!modal_item);

		if (typeof imageId === "string") {
			setImageId(imageId);
			fireGetDoc("images", imageId).then((doc) => {
				if (doc.exists) {
					setImageName(doc.data().imageName);
					setPrice(doc.data().price);
				}
			});

			fireAuth.onAuthStateChanged((user) => {
				if (user) {
					fireGetDocs("shoppingCart").then((snap) => {
						let isItemExist = false;
						snap.forEach((doc) => {
							if (
								doc.data().email === user.email &&
								doc.data().itemId === imageId
							) {
								setShoppingCartId(doc.id);
								isItemExist = true;
							}
						});
						setEmail(user.email);
						setIsItemExistInCart(isItemExist);
					});
				}
			});
		}
	};

	const closeToggle = () => {
		setModal_item(!modal_item);
	};

	const onChange_item = (e) => {
		if (e.target.value < 1) {
			setQty(1);
		} else {
			setQty(e.target.value);
		}
	};

	const onSubmitEditCartItem = (e) => {
		e.preventDefault();

		if (isItemExistInCart) {
			// Update the existing item in shopping cart
			fireUpdateDoc("shoppingCart", shoppingCartId, {
				qty,
			})
				.then(function () {
					console.log("Shopping Cart Updated successfully");
				})
				.catch(function (error) {
					console.error("Error Updating Shopping Cart: ", error);
				});
		} else {
			// Create new item in shopping cart
			fireAddNewDoc("shoppingCart", {
				qty,
				email: email,
				itemName: imageName,
				itemId: imageId,
				price: price,
				createdAt: Timestamp.now(),
			})
				.then(function () {
					console.log("Item has been added successfully");
					setToggleUserShoppingCart(!toggleUserShoppingCart);
				})
				.catch(function (error) {
					console.error("Error adding document: ", error);
				});
		}

		closeToggle();
		setQty(1);
		setNoticeEditShopCart(true);
	};

	const onCloseNoticeEditShopCart = () => {
		setNoticeEditShopCart(false);
	};

	if (!items.products)
		return (
			<div className="img-grid">
				<Loader />
			</div>
		);

	if (items?.products?.length === 0)
		return <ErrorPage errMsg="No Result Found" />;

	return (
		<>
			<div className="itemsHeader">
				<span>Products</span>
				<span>{`${items?.products?.length} of ${items?.totalNumOfProducts}`}</span>
			</div>
			<div className="img-grid">
				{items?.products?.map((doc) => (
					<motion.div
						drag="x"
						dragConstraints={{ left: -100, right: 100 }}
						whileHover={{ scale: 1.1 }}
						className="img-wrap"
						key={doc.id}
					>
						<Link to={`/itemDetail/${doc.id}`}>
							<img src={doc.url} alt={doc.url} />
						</Link>
						<div className="item_action">
							<div>
								<Tooltip
									title={doc.imageName}
									placement="top-start"
								>
									<h5>{doc.imageName}</h5>
								</Tooltip>
							</div>
							<div>
								<h5>${doc.price}</h5>
							</div>
							<div>
								{user ? (
									<h5
										className="addToCart"
										onClick={() => editCartItem(doc.id)}
									>
										ADD TO CART
									</h5>
								) : (
									<Link to="/login">
										<h5
											className="addToCart"
											onClick={() => editCartItem(doc.id)}
										>
											ADD TO CART
										</h5>
									</Link>
								)}
							</div>
						</div>
					</motion.div>
				))}

				<Modal isOpen={modal_item} toggle={editCartItem}>
					<ModalHeader toggle={editCartItem}>
						ADD/EDIT to Shopping cart
					</ModalHeader>
					<ModalBody>
						<Form onSubmit={onSubmitEditCartItem}>
							<FormGroup>
								<Input
									type="number"
									name="qty"
									id="item"
									value={qty}
									onChange={onChange_item}
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
				<NotificationMui
					isOpen={noticeEditShopCart}
					onClose={onCloseNoticeEditShopCart}
					message={
						"Your shopping cart has been updated successfully."
					}
					duration={5000}
					position={{ vertical: "top", horizontal: "right" }}
					type={"success"}
				/>
			</div>
		</>
	);
};

export default ImageGrid;
