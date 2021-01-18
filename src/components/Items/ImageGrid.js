import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import UseFirestore from '../Firebase/UseFirestore';
import {fire, timestamp} from "../../config/fire";
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';
import { motion } from "framer-motion";
import './ImageGrid.scss';
import {AuthContext} from '../Auth/AuthContext';

const ImageGrid = ({ search }) => {

    const { docs } = UseFirestore('images');
    const [isItemExistInCart, setIsItemExistInCart] = useState(false);
    const [shoppingCartId, setShoppingCartId] = useState(null);
    const [qty, setQty] = useState(0);
    const [url, setUrl] = useState("");
    const [email, setEmail] = useState("");
    const [imageName, setImageName] = useState("");
    const [price, setPrice] = useState(0);
    const [modal_item, setModal_item] = useState(false);
    const [imageId, setImageId] = useState(null);
    const [user, setUser] = useContext(AuthContext);


  // Add or Edit item to Shopping cart
  const toggle_item = (imageId) => {
    
    setModal_item(!modal_item);

    if(typeof imageId === 'string'){
      setImageId(imageId);

      fire.firestore().collection("images").doc(imageId).get().then(doc => {
        if(doc.exists){
          setUrl(doc.data().url);
          setImageName(doc.data().imageName);
          setPrice(doc.data().price);
        }
      })
  
      fire.auth().onAuthStateChanged(user => {
        if(user){
          fire.firestore().collection("shoppingCart")
              .orderBy('createdAt', 'desc')
              .onSnapshot(snap => {
                  let isItemExist = false;
                  snap.forEach(doc => {
                    if(doc.data().email === user.email && doc.data().itemId === imageId){
                        setShoppingCartId(doc.id);
                        isItemExist = true;
                      }
                    });
                  setEmail(user.email);
                  setIsItemExistInCart(isItemExist);
              });
        }
      })
    }
    
  }

  const closeToggle = () => {
    setModal_item(!modal_item);
  }

  const onChange_item = (e) => {
    setQty(e.target.value);
  }

  const onSubmit_item = (e) => {

    e.preventDefault();


    if(isItemExistInCart){
      //Update the existing item in shopping cart
      fire.firestore().collection("shoppingCart").doc(shoppingCartId).update({ 
          qty: qty == 0 ? 1: qty,
        })
        .then(function(docRef) {
            console.log("Shopping Cart Updated successfully");
        })
        .catch(function(error) {
            console.error("Error Updating Shopping Cart: ", error);
        })
    }
    else{
      
      // Create new item in shopping cart
      fire.firestore().collection("shoppingCart").add({
          qty: qty == 0 ? 1: qty,
          email: email,
          itemName: imageName,
          itemId: imageId,
          price: price,
          createdAt: timestamp()
      })
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    }


    closeToggle();
  }

    return (
      <div className="img-grid">
        {docs && docs.map(doc => (
              search !== undefined ?
                doc.imageName.toLowerCase().includes(search.toLowerCase()) &&
                <motion.div drag="x"
                            dragConstraints={{ left: -100, right: 100 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }} 
                            className="img-wrap" 
                            key={doc.id}>
                    <Link to={`/itemDetail/${doc.id}`}>
                      <img src={doc.url} alt={doc.url} />
                    </Link>
                    <div className='item_action'>
                        <div><h5>{doc.imageName}</h5></div>
                        <div><h5>${doc.price}</h5></div>
                        <div>
                          {user ? <h5 className='addToCart' onClick={() => toggle_item(doc.id)}>ADD TO CART</h5>
                          : <Link to='/login'><h5 className='addToCart' onClick={() => toggle_item(doc.id)}>ADD TO CART</h5></Link>
                          }
                        </div>
                    </div> 
                </motion.div>
              :
                <motion.div drag="x"
                            dragConstraints={{ left: -100, right: 100 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="img-wrap" 
                            key={doc.id}>
                    <Link to={`/itemDetail/${doc.id}`}>
                      <img src={doc.url} alt={doc.url} />
                    </Link>
                    <div className='item_action'>
                        <div><h5>{doc.imageName}</h5></div>
                        <div><h5>${doc.price}</h5></div>
                        <div>
                          {user ? <h5 className='addToCart' onClick={() => toggle_item(doc.id)}>ADD TO CART</h5>
                          : <Link to='/login'><h5 className='addToCart' onClick={() => toggle_item(doc.id)}>ADD TO CART</h5></Link>
                          }
                        </div>
                  </div>
                </motion.div>
        ))}

        <Modal isOpen={modal_item} toggle={toggle_item}>
          <ModalHeader toggle={toggle_item}>ADD/EDIT to Shopping cart</ModalHeader>
          <ModalBody>
              <Form onSubmit={onSubmit_item}>
                  <FormGroup>
                      <Input
                          type="number"
                          name="qty"
                          id="item"
                          defaultValue={1}
                          onChange={onChange_item}
                      />
                      <Button color='dark' style={{ marginTop: '2rem' }} block>
                          OK
                      </Button>
                  </FormGroup>
              </Form>
          </ModalBody>
        </Modal>

      </div>
    )
}

export default ImageGrid;
