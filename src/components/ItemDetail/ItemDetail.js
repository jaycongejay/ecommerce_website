import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';
import {fire, timestamp} from "../../config/fire";
import './ItemDetail.scss';

export default class ItemDetail extends Component {

    constructor(props){
        super(props);
        this.state  = {
          url: null,
          imageName: null,
          modal: false,
          qty: 0,
          price: 0,
          user: null,
          isItemExistInCart: false,
          shoppingCartId: null
        }
    }


    componentDidMount(){
        const selectedId = this.props.match.params.id;

        fire.firestore().collection("images").doc(selectedId).get().then(doc => {
            if(doc.exists){
                this.setState({url: doc.data().url});
                this.setState({imageName: doc.data().imageName});
                this.setState({price: doc.data().price});
            }
        })


        fire.auth().onAuthStateChanged(user => {
            if(user){
                this.setState({user: user});
            }
            else{
                this.setState({user: null});
            }
        })
    }

    toggle = () => {
        this.setState({modal: !this.state.modal});

        fire.auth().onAuthStateChanged(user => {
            if(user){
              fire.firestore().collection("shoppingCart")
                  .orderBy('createdAt', 'desc')
                  .onSnapshot(snap => {
                      snap.forEach(doc => {
                        if(doc.data().email === user.email && doc.data().itemId === this.props.match.params.id){
                            this.setState({isItemExistInCart: true});
                            this.setState({shoppingCartId: doc.id})
                        }
                      });
                  });
            }
        })
    }

    onSubmit = e => {
        e.preventDefault();

        if(this.state.isItemExistInCart){
            // Update the existing item in shopping cart
            fire.firestore().collection("shoppingCart").doc(this.state.shoppingCartId).update({ 
                qty: this.state.qty == 0 ? 1 : this.state.qty,
              })
              .then(function(docRef) {
                  console.log("User Setting Updated successfully");
              })
              .catch(function(error) {
                  console.error("Error Updating document: ", error);
              })
        }
        else{

            // Create new item in shopping cart
            fire.firestore().collection("shoppingCart").add({
                qty: this.state.qty == 0 ? 1 : this.state.qty,
                email: this.state.user.email,
                itemName: this.state.imageName,
                itemId: this.props.match.params.id,
                price: this.state.price,
                createdAt: timestamp()
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
        
      


        this.toggle();

    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }


   


    render() {
        return (
            <div className='item_detail'>
                <div className="img_container">
                    <img src={this.state.url} alt={this.state.url} />
                    
                </div>
                <div className="description">
                    <div className='img_action'>
                        <div><h5>{this.state.imageName}</h5></div>
                        <div><h5>${this.state.price}</h5></div>
                        <div>
                        <h5 className='addToCart' onClick={this.toggle}>ADD TO CART</h5>
                        </div>
                    </div>
                </div> 

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add to Shopping Cart</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Input
                                    type="number"
                                    name="qty"
                                    id="item"
                                    defaultValue={1}
                                    onChange={this.onChange}
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
}
