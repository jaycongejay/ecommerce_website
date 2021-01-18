import React, {useContext, useState, useEffect, } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import './ShoppingCart.scss';
import {fire } from '../../config/fire';


 const ShoppingCart = (props) => {


  const [modal, setModal] = useState(false);
  const [modal_item, setModal_item] = useState(false);
  const [modal_delete_item, setModal_delete_item] = useState(false);
  const [currentUserSettingId, setCurrentUserSettingId] = useState(null);
  const [selectedModifyQty, setSelectedModifyQty] = useState(null);

  const [email, setEmail] = useState(""); // User email
  const [name, setName] = useState("");   // userSetting name
  const [phone, setPhone] = useState("");  // userSetting phone
  const [address, setAddress] = useState("");  // userSetting address
  const [docs, setDocs] = useState([]); // User's shopping cart
  const [totalShoppingAmount, setTotalShoppingAmount] = useState([]); // User's total shopping amount
  const [qty, setQty] = useState(null);
 
  useEffect(() => {

    // User setting
    fire.auth().onAuthStateChanged(user => {
      if(user){
        fire.firestore().collection("userSetting")
            .orderBy('createdAt', 'desc')
            .onSnapshot(snap => {
                snap.forEach(doc => {
                  if(doc.data().email === user.email){
                    if(doc.data().name != null) setName(doc.data().name);
                    if(doc.data().phone != null) setPhone(doc.data().phone);
                    if(doc.data().address != null) setAddress(doc.data().address);
                    setEmail(doc.data().email);
                    setCurrentUserSettingId(doc.id);
                  }
                });
            });
      }
    })


   // Shopping Cart
   fire.auth().onAuthStateChanged(user => {
      if(user){
        fire.firestore().collection("shoppingCart")
            .orderBy('createdAt', 'desc')
            .onSnapshot(snap => {
                let documents = [];
                let totalShoppingAmount = 0;
                snap.forEach(doc => {
                  if(doc.data().email === user.email){
                    documents.push({...doc.data(), id: doc.id});
                    totalShoppingAmount += doc.data().qty * doc.data().price;
                  }
                });
                setDocs(documents);
                setTotalShoppingAmount(totalShoppingAmount.toFixed(2));
            });
      }
    })

  }, [])
  

  const toggle = () => {
    setModal(!modal);
  }

  const onChange = (e) => {
    if(e.target.name === 'name') setName(e.target.value)
    if(e.target.name === 'phone') setPhone(e.target.value)
    if(e.target.name === 'address') setAddress(e.target.value)
  }

  const onSubmit = (e) => {

    e.preventDefault();

    fire.firestore().collection("userSetting").doc(currentUserSettingId).update({ 
      name: name,
      phone: phone,
      address: address
    })
    .then(function(docRef) {
        console.log("User Setting Updated successfully");
    })
    .catch(function(error) {
        console.error("Error Updating document: ", error);
    })

    toggle();
  }

  

  // Edit item
  const toggle_item = (selected_qty) => {
    setSelectedModifyQty(selected_qty);
    setModal_item(!modal_item);
  }

  const onChange_item = (e) => {
    setQty(e.target.value);
  }

  const onSubmit_item = (e) => {

    e.preventDefault();

    // Update the existing item in shopping cart
    fire.firestore().collection("shoppingCart").doc(props.match.params.id).update({ 
      qty: qty == null ? selectedModifyQty : qty,
    })
    .then(function(docRef) {
        console.log("User Setting Updated successfully");
    })
    .catch(function(error) {
        console.error("Error Updating document: ", error);
    })

    toggle_item();
  }



  // Delete item
  const toggle_delete_item = () => {
    setModal_delete_item(!modal_delete_item);
  }

  const delete_item = (e) =>{

    e.preventDefault();

    fire.firestore().collection("shoppingCart").doc(props.match.params.id).delete().then(function() {
        console.log("Document successfully deleted!");
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });

    toggle_delete_item();
  }

  return (
    <div className='shopping_cart_container'>
      <h3>Your shopping cart</h3>
      <div className='content_container'>
        <h4 className='title_account'>Account</h4>
        <h4 className='title'>Qty</h4>
        <h4 className='title'>Item</h4>
        <h4 className='title'>Price</h4>
        <div className='account'>
          <ul>
            <li><span>Name:</span>&ensp;&ensp;{name}</li>
            <li><span>Email:</span>&ensp;&ensp;{email}</li>
            <li><span>Phone:</span>&ensp;&ensp;{phone}</li>
            <li><span>Address:</span>&ensp;&ensp;{address}</li>
          </ul>
        </div>
        <div className='shoppingCart'>
          <ul>
            {docs && docs.map(doc => (
                <li className="item" key={doc.id}>
                  <div className='qty'>
                    <span>{doc.qty}</span>
                  </div>
                  <div className='itemName'>
                    <span>{doc.itemName}</span>
                  </div>
                  <div className='price'>
                    <span>$ {doc.price}</span>
                  </div>
                  <div className='edit_icon'>
                    <Link to={`/shoppingCart/${doc.id}`}><i onClick={() => toggle_item(doc.qty)} className="fas fa-caret-square-down fa-3x"></i></Link>
                  </div>
                  <div className='edit_icon'>
                    <Link to={`/shoppingCart/${doc.id}`}><i onClick={toggle_delete_item} className="fas fa-trash-alt fa-3x"></i></Link>
                  </div>
                </li>
            ))}
          </ul>
        </div>
        <div><button onClick={toggle} className='setting_btn'>Setting</button></div>
        <div className='total_amount'><span className='total'>Total</span>{`$ ${totalShoppingAmount}`}</div>
        <div className="checkOut"><Link to="/checkout"><button className='checkout_btn'>Check Out</button></Link></div>
      </div>

      {/* Setting Button */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Account Setting</ModalHeader>
        <ModalBody>
            <Form onSubmit={onSubmit}>
                <FormGroup>
                    <Label for="item">Name</Label>
                    <Input
                        type="text"
                        name="name"
                        id="item"
                        placeholder="Name"
                        defaultValue={name}
                        onChange={onChange}
                    />
                    <Label for="item">Email</Label>
                    <Input
                        type="text"
                        name="email"
                        id="item"
                        placeholder="example@example.com"
                        defaultValue={email}
                        disabled
                    />
                    <Label for="item">Phone</Label>
                    <Input
                        type="text"
                        name="phone"
                        id="item"
                        placeholder="Phone"
                        defaultValue={phone}
                        onChange={onChange}
                    />
                    <Label for="item">Address</Label>
                    <Input
                        type="text"
                        name="address"
                        id="item"
                        placeholder="Address"
                        defaultValue={address}
                        onChange={onChange}
                    />
                    <Button color='dark' style={{ marginTop: '2rem' }} block>
                        UPDATE
                    </Button>
                </FormGroup>
            </Form>
        </ModalBody>
      </Modal>
      {/* Edit Button for each item*/}
      <Modal isOpen={modal_item} toggle={toggle_item}>
          <ModalHeader toggle={toggle_item}>EDIT</ModalHeader>
          <ModalBody>
              <Form onSubmit={onSubmit_item}>
                  <FormGroup>
                      <Input
                          type="number"
                          name="qty"
                          id="item"
                          defaultValue={selectedModifyQty}
                          onChange={onChange_item}
                      />
                      <Button color='dark' style={{ marginTop: '2rem' }} block>
                          OK
                      </Button>
                  </FormGroup>
              </Form>
          </ModalBody>
      </Modal>

      {/* Delete Button for each item*/}
      <Modal isOpen={modal_delete_item} toggle={toggle_delete_item}>
          <ModalHeader toggle={toggle_delete_item}>REMOVE</ModalHeader>
          <ModalBody>
              <Form onSubmit={delete_item}>
                  <FormGroup>
                      <Button color='dark' style={{ marginTop: '2rem' }} block>
                          REMOVE
                      </Button>
                  </FormGroup>
              </Form>
          </ModalBody>
      </Modal>
    </div>
  )
}


export default ShoppingCart;