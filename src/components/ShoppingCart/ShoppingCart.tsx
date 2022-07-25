import React, { useState, useEffect, useContext } from "react";
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	FormGroup,
	Label,
	Input,
	FormFeedback,
} from "reactstrap";
import { Link } from "react-router-dom";
import "./ShoppingCart.scss";
import {
	fireAuth,
	fireDeleteDoc,
	fireGetDocs,
	fireUpdateDoc,
} from "../../config/fire";
import { ShoppingCartInfoContext } from "../ShoppingCartInfo/ShoppingCartInfo";
import { accountSettingValidation } from "./ShoppingCartValidation";
import { UserAccount, UserCountSettingFeild } from "./ShoppingCartTypes";
import xss from "xss";
import NotificationMui from "../Notification/notification";
import Loader from "../loader/loader";

const ShoppingCart = (props) => {
	const [settingModal, setSettingModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [modal_delete_item, setModal_delete_item] = useState(false);
	const [currentUserSettingId, setCurrentUserSettingId] = useState(null);
	const [userAccount, setUserAccount] = useState<Partial<UserAccount>>({});
	const [userAccountModal, setUserAccountModal] = useState<
		Partial<UserAccount>
	>({});
	const [userAccountModalUpdated, setUserAccountModalUpdated] =
		useState<boolean>(false);
	const [docs, setDocs] = useState(undefined); // User's shopping cart
	const [totalShoppingAmount, setTotalShoppingAmount] = useState(""); // User's total shopping amount
	const [qty, setQty] = useState(1);
	const [noticeSetting, setNoticeSetting] = useState(false);
	const [noticeCheckout, setNoticeCheckout] = useState(false);
	const [noticeEditShopCart, setNoticeEditShopCart] = useState(false);
	const [toggleUserShoppingCart, setToggleUserShoppingCart] = useContext(
		ShoppingCartInfoContext
	);

	useEffect(() => {
		getUserSetting();
		getUserShoppingCart();
	}, []);

	// Get user setting
	const getUserSetting = () => {
		fireAuth.onAuthStateChanged((user) => {
			if (user) {
				fireGetDocs("userSetting").then((snap) => {
					const userSetting = {
						name: { value: undefined, valid: true },
						phone: { value: undefined, valid: true },
						address: { value: undefined, valid: true },
						email: { value: null, valid: true },
					};
					snap.forEach((doc) => {
						if (doc.data().email === user.email) {
							if (doc.data().name != null)
								userSetting.name.value = doc.data().name;
							if (doc.data().phone != null)
								userSetting.phone.value = doc.data().phone;
							if (doc.data().address != null)
								userSetting.address.value = doc.data().address;

							userSetting.email.value = doc.data().email;
							setCurrentUserSettingId(doc.id);
						}
					});
					setUserAccount(userSetting);
					setUserAccountModal(structuredClone(userSetting));
				});
			}
		});
	};
	// Get user shopping cart
	const getUserShoppingCart = () => {
		fireAuth.onAuthStateChanged((user) => {
			if (user) {
				fireGetDocs("shoppingCart").then((snap) => {
					let documents = [];
					let totalShoppingAmount = 0;
					snap.forEach((doc) => {
						if (doc.data().email === user.email) {
							documents.push({ ...doc.data(), id: doc.id });
							totalShoppingAmount +=
								doc.data().qty * doc.data().price;
						}
					});
					setDocs(documents);
					setTotalShoppingAmount(totalShoppingAmount.toFixed(2));
				});
			}
		});
	};

	const toggleAccountSetting = () => {
		setSettingModal(!settingModal);
		setUserAccountModal(structuredClone(userAccount));
	};

	const onChangeAccountSetting = (e) => {
		const update = structuredClone(userAccountModal);
		const cleanedValue = xss(e.target.value);
		if (e.target.name === UserCountSettingFeild.NAME)
			update.name.value = cleanedValue;
		if (e.target.name === UserCountSettingFeild.PHONE)
			update.phone.value = cleanedValue;
		if (e.target.name === UserCountSettingFeild.ADDRESS)
			update.address.value = cleanedValue;
		update.email.value = userAccount.email.value;

		accountSettingValidation(e.target.name, update);
		setUserAccountModal(update);
		setUserAccountModalUpdated(!userAccountModalUpdated);
	};

	// Edit account setting
	const onSubmitAccountSetting = (e) => {
		e.preventDefault();
		if (
			Object.keys(userAccountModal).some(
				(key) => !userAccountModal[key].valid
			)
		) {
			return;
		}
		fireUpdateDoc("userSetting", currentUserSettingId, {
			name: userAccountModal.name.value,
			phone: userAccountModal.phone.value,
			address: userAccountModal.address.value,
		})
			.then(function (docRef) {
				console.log("User Setting Updated successfully");
			})
			.catch(function (error) {
				console.error("Error Updating document: ", error);
			});
		setUserAccount(userAccountModal);
		setSettingModal(!settingModal);
		setNoticeSetting(true);
	};

	const toggleEditItem = (selected_qty: number) => {
		setQty(selected_qty);
		setEditModal(!editModal);
	};

	const onChangeEditItem = (e) => {
		if (e.target.value < 1) {
			setQty(1);
		} else {
			setQty(e.target.value);
		}
	};

	// Edit item
	const onSubmitEditItem = (e) => {
		e.preventDefault();

		// Update the existing item in shopping cart
		fireUpdateDoc("shoppingCart", props.match.params.id, {
			qty,
		})
			.then(function (docRef) {
				console.log("User Shopping Cart Updated successfully");
			})
			.catch(function (error) {
				console.error("Error Updating document: ", error);
			});

		getUserShoppingCart();
		setEditModal(!editModal);
		setNoticeEditShopCart(true);
	};

	const toggleDeleteItem = () => {
		setModal_delete_item(!modal_delete_item);
	};
	// Delete item
	const deleteItem = (e) => {
		e.preventDefault();
		fireDeleteDoc("shoppingCart", props.match.params.id)
			.then(function () {
				console.log("Item successfully deleted!");
			})
			.catch(function (error) {
				console.error("Error removing document: ", error);
			});

		getUserShoppingCart();
		toggleDeleteItem();
		setToggleUserShoppingCart(!toggleUserShoppingCart);
		setNoticeEditShopCart(true);
	};

	const onCloseNoticeSetting = () => {
		setNoticeSetting(false);
	};
	const onCloseNoticeCheckout = () => {
		setNoticeCheckout(false);
	};
	const onCloseNoticeEditShopCart = () => {
		setNoticeEditShopCart(false);
	};
	const onCheckout = () => {
		if (docs.length === 0) {
			setNoticeCheckout(true);
		} else {
			window.location.href = "/checkout";
		}
	};
	if (!docs) return <Loader />;
	return (
		<div className="shopping_cart_container">
			<h3>Your shopping cart</h3>
			<div className="content_container">
				<div className="accountContainer">
					<h4 className="colAccount">Account</h4>
					<div className="account">
						<ul>
							<li>
								<span>Name:</span>&ensp;&ensp;
								{userAccount.name?.value}
							</li>
							<li>
								<span>Email:</span>&ensp;&ensp;
								{userAccount.email?.value}
							</li>
							<li>
								<span>Phone:</span>&ensp;&ensp;
								{userAccount.phone?.value}
							</li>
							<li>
								<span>Address:</span>&ensp;&ensp;
								{userAccount.address?.value}
							</li>
						</ul>
						<div>
							<button
								onClick={() => setSettingModal(!settingModal)}
								className="setting_btn"
							>
								Setting
							</button>
						</div>
					</div>
				</div>
				<div className="shoppingCart">
					<div className="cartItemCols">
						<h4 className="colQty">Qty</h4>
						<h4 className="colItem">Item</h4>
						<h4 className="colPrice">Price</h4>
						<h4 className="colEdit"></h4>
						<h4 className="colDelete"></h4>
					</div>
					<ul>
						{docs &&
							docs.map((doc) => (
								<li className="item" key={doc.id}>
									<div className="qty">
										<span>{doc.qty}</span>
									</div>
									<div className="itemName">
										<span>{doc.itemName}</span>
									</div>
									<div className="price">
										<span>$ {doc.price}</span>
									</div>
									<div className="edit_icon">
										<Link to={`/shoppingCart/${doc.id}`}>
											<i
												onClick={() =>
													toggleEditItem(doc.qty)
												}
												className="fas fa-caret-square-down fa-3x"
											></i>
										</Link>
									</div>
									<div className="edit_icon">
										<Link to={`/shoppingCart/${doc.id}`}>
											<i
												onClick={toggleDeleteItem}
												className="fas fa-trash-alt fa-3x"
											></i>
										</Link>
									</div>
								</li>
							))}
					</ul>
					<div className="checkoutBox">
						<div className="total_amount">
							<span className="total">Total</span>
							{`$ ${totalShoppingAmount}`}
						</div>
						<div className="checkOut">
							<button
								className="checkout_btn"
								onClick={onCheckout}
							>
								Check Out
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Setting Button */}
			<Modal isOpen={settingModal} toggle={toggleAccountSetting}>
				<ModalHeader toggle={toggleAccountSetting}>
					Account Setting
				</ModalHeader>
				<ModalBody>
					<Form onSubmit={onSubmitAccountSetting}>
						<FormGroup>
							<Label for="item">Name</Label>
							<Input
								type="text"
								name={UserCountSettingFeild.NAME}
								id="item"
								placeholder="Name"
								defaultValue={userAccountModal.name?.value}
								onChange={onChangeAccountSetting}
								invalid={!userAccountModal.name?.valid}
							/>
							<FormFeedback>
								{userAccountModal.name?.invalidMsg}
							</FormFeedback>
						</FormGroup>
						<FormGroup>
							<Label for="item">Email</Label>
							<Input
								type="email"
								name={UserCountSettingFeild.EMAIL}
								id="item"
								placeholder="example@example.com"
								defaultValue={userAccountModal.email?.value}
								disabled
							/>
						</FormGroup>
						<FormGroup>
							<Label for="item">Phone</Label>
							<Input
								type="tel"
								name={UserCountSettingFeild.PHONE}
								id="item"
								placeholder="+1)"
								defaultValue={userAccountModal.phone?.value}
								onChange={onChangeAccountSetting}
								invalid={!userAccountModal.phone?.valid}
							/>
							<FormFeedback>
								{userAccountModal.phone?.invalidMsg}
							</FormFeedback>
						</FormGroup>
						<FormGroup>
							<Label for="item">Address</Label>
							<Input
								type="text"
								name={UserCountSettingFeild.ADDRESS}
								id="item"
								placeholder="Address"
								defaultValue={userAccountModal.address?.value}
								onChange={onChangeAccountSetting}
								invalid={!userAccountModal.address?.valid}
							/>
							<FormFeedback>
								{userAccountModal.address?.invalidMsg}
							</FormFeedback>
						</FormGroup>
						<Button
							color="dark"
							style={{ marginTop: "2rem" }}
							block
						>
							UPDATE
						</Button>
					</Form>
				</ModalBody>
			</Modal>
			{/* Edit Button for each item*/}
			<Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
				<ModalHeader toggle={() => setEditModal(!editModal)}>
					EDIT
				</ModalHeader>
				<ModalBody>
					<Form onSubmit={onSubmitEditItem}>
						<FormGroup>
							<Input
								type="number"
								name="qty"
								id="item"
								value={qty}
								onChange={onChangeEditItem}
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

			{/* Delete Button for each item*/}
			<Modal isOpen={modal_delete_item} toggle={toggleDeleteItem}>
				<ModalHeader toggle={toggleDeleteItem}>REMOVE</ModalHeader>
				<ModalBody>
					<Form onSubmit={deleteItem}>
						<FormGroup>
							<Button
								color="dark"
								style={{ marginTop: "2rem" }}
								block
							>
								REMOVE
							</Button>
						</FormGroup>
					</Form>
				</ModalBody>
			</Modal>
			<NotificationMui
				isOpen={noticeSetting}
				onClose={onCloseNoticeSetting}
				message={"Your account has been updated successfully."}
				duration={5000}
				position={{ vertical: "top", horizontal: "left" }}
				type={"success"}
			/>
			<NotificationMui
				isOpen={noticeCheckout}
				onClose={onCloseNoticeCheckout}
				message={"Your shopping cart is empty."}
				duration={5000}
				position={{ vertical: "top", horizontal: "center" }}
				type={"error"}
			/>
			<NotificationMui
				isOpen={noticeEditShopCart}
				onClose={onCloseNoticeEditShopCart}
				message={"Your shopping cart has been updated successfully."}
				duration={5000}
				position={{ vertical: "top", horizontal: "right" }}
				type={"success"}
			/>
		</div>
	);
};

export default ShoppingCart;
