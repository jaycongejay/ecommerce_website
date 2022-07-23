import React, { useContext, useEffect, useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Tooltip from "@material-ui/core/Tooltip";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button, Input, InputGroup } from "reactstrap";
import { fire } from "../../config/fire";
import { AuthContext } from "../Auth/AuthContext";
import "./NavBar.scss";
import { MAIN_MENU_ITEMS, TOY_NEWS_ITEMS } from "./NavBarF";

const NavBar = () => {
	const [user, setUser] = useContext(AuthContext);
	const [numOfItemShoppingCart, setNumOfItemShoppingCart] = useState(null);
	const [menuBtn, setMenuBtn] = useState(false);
	const [myaccountBtn, setMyaccountBtn] = useState(false);
	const [searchInput, setSearchInput] = useState("");

	useEffect(() => {
		fire.auth().onAuthStateChanged((user) => {
			if (user) {
				fire.firestore()
					.collection("shoppingCart")
					.orderBy("createdAt", "desc")
					.onSnapshot((snap) => {
						let numOfItemAddedInShoppingCart = 0;
						snap.forEach((doc) => {
							if (doc.data().email === user.email) {
								numOfItemAddedInShoppingCart++;
							}
						});
						setNumOfItemShoppingCart(numOfItemAddedInShoppingCart);
					});
			}
		});
		if (window.location.pathname.split("/")[1].includes("search")) {
			setSearchInput(decodeURI(window.location.pathname.split("/")[2]));
		}
	}, []);

	const toggleMenu = () => {
		setMenuBtn(!menuBtn);
	};
	const toggleMyaccount = () => {
		setMyaccountBtn(true);
	};
	const onAdmin = () => {
		setMyaccountBtn(false);
	};

	const handleClickAwayMenu = () => {
		setMenuBtn(false);
	};
	const handleClickAwayMyAccount = () => {
		setMyaccountBtn(false);
	};

	const logout = () => {
		fire.auth().signOut();
		window.location.href = `/login`;
	};

	const searchInputChange = (e) => {
		setSearchInput(e.target.value);
	};
	const searchProducts = (e) => {
		if (e.key === "Enter") {
			window.location.href =
				searchInput === "" ? `/item` : `/search/${searchInput}`;
		}
	};
	const onClickSearch = (e) => {
		window.location.href = `/search/${searchInput}`;
	};
	const clearSearchInput = () => {
		setSearchInput("");
		window.location.href = `/item`;
	};

	return (
		<Navbar>
			<ClickAwayListener onClickAway={handleClickAwayMenu}>
				<div>
					<Button className="menuBtn" onClick={toggleMenu}>
						<Tooltip title="Menu">
							<i className="fas fa-bars"></i>
						</Tooltip>
					</Button>
					{menuBtn ? (
						<motion.div className="side_menu">
							{MAIN_MENU_ITEMS.map((item, index) => (
								<motion.p
									key={index}
									whileHover={{ scale: 1.3, originX: 0 }}
								>
									<Link to={item.nav} className="menu">
										{item.name}
									</Link>
								</motion.p>
							))}
						</motion.div>
					) : null}
				</div>
			</ClickAwayListener>
			<Navbar.Brand href="/">TOY SHOP</Navbar.Brand>
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<Link to="/item" style={{ padding: "8px 10px" }}>
						TOYS
					</Link>
					<Link to="/" style={{ padding: "8px 10px" }}>
						SUPPORT
					</Link>
					<NavDropdown title="TOY NEWS" id="basic-nav-dropdown">
						{TOY_NEWS_ITEMS.map((news, index) => (
							<NavDropdown.Item key={index} href={news.nav}>
								{news.name}
							</NavDropdown.Item>
						))}
					</NavDropdown>
				</Nav>
				<InputGroup className="searchBox">
					<Input
						onChange={searchInputChange}
						onKeyDown={searchProducts}
						value={searchInput}
					/>
					<span className="clearBtn" onClick={clearSearchInput}>
						<motion.img
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.3 }}
							transition={{ duration: 2.9, type: "spring" }}
							src="/clear.svg"
							width="20px"
							alt="clearIcon"
						/>
					</span>
					<Button className="searchBtn" onClick={onClickSearch}>
						<i className="fas fa-search"></i>
					</Button>
				</InputGroup>
			</Navbar.Collapse>
			<Link to="/shoppingCart">
				{user ? (
					<>
						<motion.img
							initial={{ y: -100 }}
							animate={{ y: 0 }}
							src="/bag.png"
							width="30px"
							alt="bagIcon"
						/>
						<span className="num_of_items_in_cart">
							{numOfItemShoppingCart}
						</span>
					</>
				) : (
					<motion.div initial={{ y: -100 }} animate={{ y: 0 }}>
						<img src="/bag.png" width="30px" alt="bagIcon" />
						<span className="num_of_items_in_cart">0</span>
						&ensp;&ensp;&ensp;
					</motion.div>
				)}
			</Link>
			<ClickAwayListener onClickAway={handleClickAwayMyAccount}>
				<div>
					<img
						className="my_account_icon"
						src="/my_account.png"
						onClick={toggleMyaccount}
						width="40px"
						height="40px"
						alt="my account icon"
						style={{ marginRight: "20px" }}
					/>
					{myaccountBtn ? (
						<div className="account_menu">
							{user ? (
								<>
									{user.email === "admin@shopping.com" ? (
										<>
											<Link
												to="/management"
												onClick={onAdmin}
												className="admin"
											>
												<i className="fas fa-user-cog"></i>
											</Link>
											<Link
												onClick={logout}
												className="logout"
											>
												LOGOUT
											</Link>
										</>
									) : (
										<>
											<p className="user">
												{user.email}&ensp;&ensp;&ensp;
											</p>
											<Link
												onClick={logout}
												className="logout"
											>
												LOGOUT
											</Link>
										</>
									)}
								</>
							) : (
								<Link to="/login" className="login">
									LOGIN
								</Link>
							)}
						</div>
					) : null}
				</div>
			</ClickAwayListener>
		</Navbar>
	);
};

export default NavBar;
