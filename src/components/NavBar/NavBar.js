import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { InputGroup, InputGroupAddon, Button, Input  } from 'reactstrap';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Tooltip from '@material-ui/core/Tooltip';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import './NavBar.scss';
import {fire} from "../../config/fire";
import {AuthContext} from '../Auth/AuthContext';
import bagIcon from '../../assets/images/bag.png';
import myAccountIcon from '../../assets/images/my_account.png';

const NavBar = () => {

    const [user, setUser] = useContext(AuthContext);
    const [numOfItemShoppingCart, setNumOfItemShoppingCart] = useState(null);
    const [menuBtn, setMenuBtn] = useState(false);
    const [myaccountBtn, setMyaccountBtn] = useState(false);
    const [searchInput, setSearchInput] = useState(null);


    useEffect(() => {
        fire.auth().onAuthStateChanged(user => {
            if(user){
              fire.firestore().collection("shoppingCart")
                  .orderBy('createdAt', 'desc')
                  .onSnapshot(snap => {
                      let numOfItemAddedInShoppingCart = 0;
                      snap.forEach(doc => {
                        if(doc.data().email === user.email){
                            numOfItemAddedInShoppingCart++;
                        }
                      });
                      setNumOfItemShoppingCart(numOfItemAddedInShoppingCart)
                  });
            }
          });
    }, [])

    const toggleMenu = () => {
        setMenuBtn(!menuBtn);
    }
    const toggleMyaccount = () => {
        setMyaccountBtn(!myaccountBtn);
    }

    const handleClickAwayMenu = () => {
        setMenuBtn(false);
    };
    const handleClickAwayMyAccount = () => {
        setMyaccountBtn(false);
    };

    const logout = () => {
        fire.auth().signOut();
    }

    const searchInputChange = (e) =>{
        setSearchInput(e.target.value);
    }


    return (
        <Navbar>
            <ClickAwayListener onClickAway={handleClickAwayMenu}>
                <div>
                    <Button className="menuBtn" onClick={toggleMenu}>
                        <Tooltip title='Menu'>
                            <i className="fas fa-bars"></i>
                        </Tooltip>
                    </Button>
                    {menuBtn ? 
                        <motion.div className="side_menu">
                            <motion.p whileHover={{ scale: 1.3, originX: 0}}><Link to="/" className="menu">Action Figures</Link></motion.p>
                            <motion.p whileHover={{ scale: 1.3, originX: 0}}><Link to="/" className="menu">Arts &amp; Crafts</Link></motion.p>
                            <motion.p whileHover={{ scale: 1.3, originX: 0}}><Link to="/" className="menu">Dolls &amp; Playsets</Link></motion.p>
                            <motion.p whileHover={{ scale: 1.3, originX: 0}}><Link to="/" className="menu">Vehicles, Trains &amp; Playsets</Link></motion.p>
                            <motion.p whileHover={{ scale: 1.3, originX: 0}}><Link to="/" className="menu">Plush &amp; Stuffed Animals</Link></motion.p>
                            <motion.p whileHover={{ scale: 1.3, originX: 0}}><Link to="/" className="menu">Trending Cards &amp; Collectibles</Link></motion.p>
                        </motion.div>
                    :
                        null
                    }
                </div>
            </ClickAwayListener>
            <Navbar.Brand href="/">TOY SHOP</Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Link to="/item" style={{padding: "8px 10px"}}>TOYS</Link>
                    <Link to="#link" style={{padding: "8px 10px"}}>SUPPORT</Link>
                    <NavDropdown title="TOY NEWS" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <InputGroup>
                    <Input onChange={searchInputChange} />
                    <InputGroupAddon addonType="append">
                        {searchInput ?
                        <Link to={`/search/${searchInput}`}>
                            <Button className="searchBtn"><i className="fas fa-search"></i></Button>
                        </Link>
                        :
                        <Button className="searchBtn"><i className="fas fa-search"></i></Button>
                        } 
                    </InputGroupAddon>
                </InputGroup>
            </Navbar.Collapse>
            <Link to="/shoppingCart">
                {user ?
                        <>
                        <motion.img initial={{ y: -100}} animate={{ y: 0}}
                         src={bagIcon} width="30px" alt="bagIcon"/><span className='num_of_items_in_cart'>{numOfItemShoppingCart}</span>
                        </>
                :
                    <motion.div initial={{ y: -100}} animate={{ y: 0}}>
                        <img src={bagIcon} width="30px" alt="bagIcon"/><span className='num_of_items_in_cart'>0</span>&ensp;&ensp;&ensp;
                    </motion.div>
                }
            </Link>
            <ClickAwayListener onClickAway={handleClickAwayMyAccount}>
                <div>
                    <img className="my_account_icon" src={myAccountIcon} onClick={toggleMyaccount} width="40px" height="40px" alt="my account icon" style={{marginRight: "20px"}}/>
                    {myaccountBtn ? 
                        <div className="account_menu">
                                {user ?
                                    <>
                                    {user.email == 'admin@shopping.com' ?
                                        <>
                                        <Link to="/management" className="admin"><i className="fas fa-user-cog"></i></Link>
                                        <Nav.Link href="#logout" onClick={logout} className="logout">LOGOUT</Nav.Link>
                                        </>
                                    :
                                        <>
                                        <p className="user">{user.email}&ensp;&ensp;&ensp;</p>
                                        <Link to='/' className="logout txt" onClick={logout}>LOGOUT</Link>
                                        </>
                                    }
                                    </>
                                    :
                                    <Link to='/login' className="login">LOGIN</Link>
                                }
                        </div>
                    :
                        null
                    }
                </div>
            </ClickAwayListener>
            
            
        </Navbar>
    )
}

export default NavBar
