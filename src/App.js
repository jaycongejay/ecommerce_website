import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Login from "./components/Login/Login";
import PrivateRoute from "./components/Route/PrivateRoute";
import Home from "./components/Home/Home";
import ShoppingCart from "./components/ShoppingCart/ShoppingCart";
import Footer from "./components/Footer/Footer";
import Item from "./components/Items/Item";
import { AuthProvider } from "./components/Auth/AuthContext";
import ItemDetail from "./components/ItemDetail/ItemDetail";
import CheckOut from "./components/Checkout/CheckOut";
import Management from "./components/management/Management";
import { fire } from "./config/fire";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
			visible: false,
		};
	}

	componentDidMount() {
		this.authListener();
	}

	authListener() {
		fire.auth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({ user: user });
			} else {
				this.setState({ user: null });
			}
		});
	}

	toggleShow = () => {
		this.setState({ visible: !this.state.visible });
	};

	render() {
		return (
			<Router>
				<AuthProvider>
					<NavBar />
					<div className="bodyContentContainer">
						<Switch>
							<Route path="/" exact component={Home} />
							<Route path="/login" exact component={Login} />
							<Route path="/item" exact component={Item} />
							<PrivateRoute
								path="/item/:id"
								component={Item}
								auth={this.state.user}
							/>
							<PrivateRoute
								path="/itemDetail/:id"
								component={ItemDetail}
								auth={this.state.user}
							/>
							<PrivateRoute
								path="/shoppingCart"
								exact
								component={ShoppingCart}
								auth={this.state.user}
							/>
							<PrivateRoute
								path="/shoppingCart/:id"
								component={ShoppingCart}
								auth={this.state.user}
							/>
							<PrivateRoute
								path="/checkout"
								component={CheckOut}
								auth={this.state.user}
							/>
							<PrivateRoute
								path="/management"
								component={Management}
								auth={this.state.user}
							/>
							<PrivateRoute
								path="/search/:txt"
								component={Item}
								auth={this.state.user}
							/>
						</Switch>
					</div>
					<Footer />
				</AuthProvider>
			</Router>
		);
	}
}

export default App;
