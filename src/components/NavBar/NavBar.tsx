import React, { useCallback, useContext, useEffect, useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Tooltip from "@material-ui/core/Tooltip";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button, Input, InputGroup } from "reactstrap";
import { fireAuth, fireGetDocs, fireSignOut } from "../../config/fire";
import { AuthContext } from "../Auth/AuthContext";
import "./NavBar.scss";
import { MAIN_MENU_ITEMS, TOY_NEWS_ITEMS } from "./NavBarF";
import { ShoppingCartInfoContext } from "../ShoppingCartInfo/ShoppingCartInfo";
import xss from "xss";
import NotificationMui from "../Notification/notification";

const NavBar = () => {
	const [user, setUser] = useContext(AuthContext);
	const [toggleUserShoppingCart, setToggleUserShoppingCart] = useContext(
		ShoppingCartInfoContext
	);
	const [numOfShopItems, setNumOfShopItems] = useState(undefined);
	const [menuBtn, setMenuBtn] = useState(false);
	const [myaccountBtn, setMyaccountBtn] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [showHoverShopCart, setShowHoverShopCart] = useState(false);
	const [noticeLogOut, setNoticeLogOut] = useState(false);

	useEffect(() => {
		fireAuth.onAuthStateChanged((user) => {
			if (user) {
				fireGetDocs("shoppingCart").then((snap) => {
					let numOfItemAddedInShoppingCart = 0;
					snap.forEach((doc) => {
						if (doc.data().email === user.email) {
							numOfItemAddedInShoppingCart++;
						}
					});
					setNumOfShopItems(numOfItemAddedInShoppingCart);
				});
			}
		});
		if (window.location.pathname.split("/")[1].includes("search")) {
			setSearchInput(decodeURI(window.location.pathname.split("/")[2]));
		}
	}, [toggleUserShoppingCart]);

	useEffect(() => {
		window.addEventListener("scroll", onScrollShowHoverShopCart);
		return () =>
			window.removeEventListener("scroll", onScrollShowHoverShopCart);
	}, []);

	const onScrollShowHoverShopCart = useCallback(() => {
		if (
			window.location.pathname.split("/")[1] === "item" ||
			window.location.pathname.split("/")[1] === "search" ||
			window.location.pathname.split("/")[1] === ""
		) {
			if (window.pageYOffset > 2) {
				setShowHoverShopCart(true);
			} else {
				setShowHoverShopCart(false);
			}
		} else {
			setShowHoverShopCart(false);
		}
	}, [showHoverShopCart]);

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

	const logIn = () => {
		setMyaccountBtn(false);
	};
	const logout = () => {
		fireSignOut(fireAuth).then(() => {
			setNoticeLogOut(true);
			setMyaccountBtn(false);
		});
	};

	const searchInputChange = (e) => {
		setSearchInput(xss(e.target.value));
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
	const onCloseNoticeLogOut = () => {
		setNoticeLogOut(false);
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
							{numOfShopItems}
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
												to="/login"
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
												to="/login"
												onClick={logout}
												className="logout"
											>
												LOGOUT
											</Link>
										</>
									)}
								</>
							) : (
								<Link
									to="/login"
									className="login"
									onClick={logIn}
								>
									LOGIN
								</Link>
							)}
						</div>
					) : null}
				</div>
			</ClickAwayListener>
			{showHoverShopCart && (
				<motion.div
					className="hoverShoppingCart"
					animate={{
						scale: [1, 2, 2, 1, 1],
						rotate: [0, 0, 180, 180, 0],
						borderRadius: ["50%", "50%", "50%", "50%", "30%"],
					}}
					transition={{
						duration: 1.5,
						ease: "easeInOut",
						times: [0, 0.2, 0.5, 0.8, 1],
						repeat: 0,
						repeatDelay: 1,
					}}
				>
					<Link to="/shoppingCart">
						<motion.img
							initial={{ y: -100 }}
							animate={{ y: 0 }}
							src="/bag.png"
							width="30px"
							alt="bagIcon"
						/>
						<span className="num_of_items_in_cart">
							{user ? numOfShopItems : 0}
						</span>
					</Link>
				</motion.div>
			)}
			<NotificationMui
				isOpen={noticeLogOut}
				onClose={onCloseNoticeLogOut}
				message={"You have been successfully logged out."}
				duration={5000}
				position={{ vertical: "top", horizontal: "right" }}
				type={"success"}
			/>
		</Navbar>
	);
};

export default NavBar;
