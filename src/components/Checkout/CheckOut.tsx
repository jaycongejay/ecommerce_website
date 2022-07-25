import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { fireAuth, fireGetDocs } from "../../config/fire";
import countryRegionData from "country-region-data/dist/data-umd";
import "./CheckOut.scss";
import Loader from "../loader/loader";

const CheckOut = () => {
	const [email, setEmail] = useState<string>(""); // User email
	const [name, setName] = useState<string>(""); // userSetting name
	const [phone, setPhone] = useState<string>(""); // userSetting phone
	const [address, setAddress] = useState<string>(""); // userSetting address
	const [totalShoppingAmount, setTotalShoppingAmount] = useState<string>(""); // User's total shopping amount
	const [total, setTotal] = useState<string>(""); // User's total shopping amount
	const [modal, setModal] = useState<boolean>(false);
	const [allCountries, setAllCountries] = useState<any[]>([]);
	const [allProvinces, setAllProvinces] = useState<any[]>([]);
	const [processPayment, setProcessPayment] = useState(false);

	useEffect(() => {
		// User setting
		fireAuth.onAuthStateChanged((user) => {
			if (user) {
				fireGetDocs("userSetting").then((snap) => {
					snap.forEach((doc) => {
						if (doc.data().email === user.email) {
							if (doc.data().name != null)
								setName(doc.data().name);
							if (doc.data().phone != null)
								setPhone(doc.data().phone);
							if (doc.data().address != null)
								setAddress(doc.data().address);
							setEmail(doc.data().email);
						}
					});
				});
			}
		});

		// Shopping Cart
		fireAuth.onAuthStateChanged((user) => {
			if (user) {
				fireGetDocs("shoppingCart").then((snap) => {
					let documents: any[] = [];
					let totalShoppingAmount = 0;
					snap.forEach((doc) => {
						if (doc.data().email === user.email) {
							documents.push({ ...doc.data(), id: doc.id });
							totalShoppingAmount +=
								doc.data().qty * doc.data().price;
						}
					});
					setTotalShoppingAmount(totalShoppingAmount.toFixed(2));
					setTotal(
						(
							parseFloat(totalShoppingAmount.toString()) + 3
						).toFixed(2)
					);
				});
			}
		});

		// Countries
		setAllCountries(countryRegionData);

		// Provinces
		fetch(
			"https://raw.githubusercontent.com/Clavicus/Testing-Requests/master/canadian-provinces.json"
		)
			.then((res) => res.json())
			.then((json) => {
				setAllProvinces(json);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	const payment = (e) => {
		e.preventDefault();

		setProcessPayment(true);

		setTimeout(() => {
			setProcessPayment(false);
			setModal(!modal);
		}, 2000);
	};

	const paymentFinished = (e) => {
		e.preventDefault();
		window.location.href = "/";
	};

	if (processPayment)
		return (
			<div className="checkoutLoader">
				<div className="info">
					Please wait, we are processing your order.
				</div>
				<Loader />
			</div>
		);

	if (!total) return <Loader />;

	return (
		<div className="checkout">
			<div className="title">
				<h3>Check out</h3>
			</div>
			<div></div>
			<div className="paymentInfo">
				<form>
					<div className="form-group">
						<label htmlFor="phone">Contact information</label>
						<input
							type="text"
							className="form-control"
							id="phone"
							placeholder="mobile phone number"
							defaultValue={phone}
						></input>
					</div>
					<div className="form-group">
						<div className="form-check">
							<input
								className="form-check-input"
								type="checkbox"
								id="gridCheck"
							></input>
							<label
								className="form-check-label"
								htmlFor="gridCheck"
							>
								Keep me up to date on news and exclusive offers
							</label>
						</div>
					</div>
					<div className="form-group">Shpping address</div>
					<div className="form-row">
						<div className="form-group col-md-6">
							<input
								type="text"
								className="form-control"
								id="firstname"
								placeholder="First name(optional)"
								defaultValue={name.split(" ")[0]}
							></input>
						</div>
						<div className="form-group col-md-6">
							<input
								type="text"
								className="form-control"
								id="lastname"
								placeholder="Last name"
								defaultValue={name.split(" ")[1]}
							></input>
						</div>
					</div>
					<div className="form-group">
						<input
							type="email"
							className="form-control"
							id="email"
							placeholder="Address"
							defaultValue={email}
						></input>
					</div>
					<div className="form-group">
						<input
							type="text"
							className="form-control"
							id="address"
							placeholder="Apartment, suite, etc. (optional)"
							defaultValue={address}
						></input>
					</div>
					<div className="form-group">
						<input
							type="text"
							className="form-control"
							id="city"
							placeholder="City"
						></input>
					</div>
					<div className="form-row">
						<div className="form-group col-md-4">
							<select id="inputState" className="form-control">
								<option>Country/Region</option>
								{allCountries.map((country, index) => (
									<option
										className={
											country.countryName !== "Canada"
												? "disabledCountryInSelect"
												: undefined
										}
										key={index}
										selected={
											country.countryName === "Canada"
										}
										disabled={
											country.countryName !== "Canada"
										}
									>
										{country.countryName}
									</option>
								))}
							</select>
						</div>
						<div className="form-group col-md-4">
							<select id="inputState" className="form-control">
								<option>Province</option>
								{allProvinces.map((province, index) => (
									<option key={index}>{province.name}</option>
								))}
							</select>
						</div>
						<div className="form-group col-md-4">
							<input
								type="text"
								className="form-control"
								id="postal_code"
								placeholder="Postal code"
							></input>
						</div>
					</div>
					<div className="form-group">
						<div className="form-check">
							<input
								className="form-check-input"
								type="checkbox"
								id="gridCheck"
							></input>
							<label
								className="form-check-label"
								htmlFor="gridCheck"
							>
								Save this information for next time
							</label>
						</div>
					</div>
					<div className="paymentBtn">
						<button type="submit" onClick={payment} className="btn">
							Payment
						</button>
					</div>
				</form>
			</div>

			<div className="container selectedItem">
				<div className="itemInfo row">
					<div>
						<img src="/bag.png" width="50px" alt="" />
					</div>
					<div className="all_item">All selected items</div>
					<div className="item_price">${totalShoppingAmount}</div>
				</div>
				<hr />
				<div className="subTotal row">
					<div>Subtotal</div>
					<div></div>
					<div>${totalShoppingAmount}</div>
				</div>
				<div className="shipping row">
					<div>Shipping</div>
					<div></div>
					<div>$3.00</div>
				</div>
				<hr />
				<div className="total row">
					<div>Total</div>
					<div></div>
					<div>CAD ${total}</div>
				</div>
			</div>

			{/* Payment Button */}
			<Modal isOpen={modal} toggle={paymentFinished}>
				<ModalHeader>Payment Result</ModalHeader>
				<ModalBody>
					<p>Your payment has been successfully processed.</p>
					<p>(This is not real - demo project)</p>
					<p> - Thank You -</p>
					<Button
						onClick={paymentFinished}
						color="dark"
						style={{ marginTop: "2rem" }}
						block
					>
						OK
					</Button>
				</ModalBody>
			</Modal>
		</div>
	);
};

export default CheckOut;
