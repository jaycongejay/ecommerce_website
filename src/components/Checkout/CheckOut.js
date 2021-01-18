import React, {useState, useEffect, } from 'react';
import {fire } from '../../config/fire';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import './CheckOut.scss';
import bagIcon from '../../assets/images/bag.png';


const CheckOut = () => {

  const [currentUserSettingId, setCurrentUserSettingId] = useState(null);
  const [email, setEmail] = useState(""); // User email
  const [name, setName] = useState("");   // userSetting name
  const [phone, setPhone] = useState("");  // userSetting phone
  const [address, setAddress] = useState("");  // userSetting address
  const [docs, setDocs] = useState([]); // User's shopping cart
  const [totalShoppingAmount, setTotalShoppingAmount] = useState(""); // User's total shopping amount
  const [total, setTotal] = useState(""); // User's total shopping amount

  const [modal, setModal] = useState(false);

  const [allCountries, setAllCountries] = useState([]);
  const [allProvinces, setAllProvinces] = useState([]);



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
                setTotal((parseFloat(totalShoppingAmount) + 3).toFixed(2));
            });
      }
    })


    // Countries
    fetch("https://ajayakv-rest-countries-v1.p.rapidapi.com/rest/v1/all", {
          "method": "GET",
          "headers": {
            "x-rapidapi-key": process.env.REACT_APP_API_KEY,
            "x-rapidapi-host": "ajayakv-rest-countries-v1.p.rapidapi.com"
          }
        })
        .then(res => res.json())
        .then(json => {
            setAllCountries(json);
        })
        .catch(err => {
          console.error(err);
        });

    // Provinces
    fetch("https://raw.githubusercontent.com/Clavicus/Testing-Requests/master/canadian-provinces.json")
    .then(res => res.json())
    .then(json =>{
      setAllProvinces(json);
    })
    .catch(err => {
      console.error(err);
    });

  }, [])


  const toggle = (e) => {
    e.preventDefault();
    setModal(!modal);
  }

  const paymentFinished = (e) => {
    e.preventDefault();
    window.location.href='/';
  }


  return (
    <div className="checkout">
      <div className="title">
        <h3>Check out</h3> 
      </div>
      <div></div>
      <div className="paymentInfo">
        <form>
          <div className="form-group">
            <label htmlFor="phone" >Contact information</label>
            <input type="text" className="form-control" id="phone" placeholder="mobile phone number" defaultValue={phone}></input>
          </div>
          <div className="form-group">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="gridCheck"></input>
              <label className="form-check-label" htmlFor="gridCheck">
              Keep me up to date on news and exclusive offers
              </label>
            </div>
          </div>
          <div className="form-group">
              Shpping address
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <input type="text" className="form-control" id="firstname" placeholder="First name(optional)" defaultValue={name.split(" ")[0]}></input>
            </div>
            <div className="form-group col-md-6">
              <input type="text" className="form-control" id="lastname" placeholder="Last name" defaultValue={name.split(" ")[1]}></input>
            </div>
          </div>
          <div className="form-group">
            <input type="email" className="form-control" id="email" placeholder="Address" defaultValue={email}></input>
          </div>
          <div className="form-group">
            <input type="text" className="form-control" id="address" placeholder="Apartment, suite, etc. (optional)" defaultValue={address}></input>
          </div>
          <div className="form-group">
            <input type="text" className="form-control" id="city" placeholder="City"></input>
          </div>
          <div className="form-row">
            <div className="form-group col-md-4">
              <select id="inputState" className="form-control">
                <option >Country/Region</option>
                {allCountries.map((country, index) => (
                  <option key={index}>{country.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-4">
              <select id="inputState" className="form-control">
                <option >Province</option>
                {allProvinces.map((province, index) => (
                  <option key={index}>{province.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-4">
              <input type="text" className="form-control" id="postal_code" placeholder="Postal code"></input>
            </div>
          </div>
          <div className="form-group">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="gridCheck"></input>
              <label className="form-check-label" htmlFor="gridCheck">
              Save this information for next time
              </label>
            </div>
          </div>
          <div className="paymentBtn">
            <button type="submit" onClick={toggle} className="btn">Payment</button>
          </div>
        </form>
      </div>
      
      <div className="container selectedItem">
        <div className="itemInfo row">
          <div>
            <img src={bagIcon} width="50px" alt=""/>
          </div>
          <div className="all_item">All selected items</div>
          <div className="item_price">${totalShoppingAmount}</div>
        </div>
        <hr/>
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
        <hr/>
        <div className="total row">
          <div>Total</div>
          <div></div>
          <div>CAD ${total}</div>
        </div>
      </div>

      {/* Payment Button */}
      <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Payment Result</ModalHeader>
          <ModalBody>
              <p>Your payment has been successfully made</p>
              <p>(This is not real - demo project)</p>
              <p> - Thank You -</p>
              <Button onClick={paymentFinished} color='dark' style={{ marginTop: '2rem' }} block>
                          OK
              </Button>
          </ModalBody>
      </Modal>
    </div>
  )
}

export default CheckOut