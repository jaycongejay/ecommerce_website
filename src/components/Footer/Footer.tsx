import React, { Component } from 'react';
import './Footer.scss';

export default class Footer extends Component {


  render() {
    return (
      <div className="footer">
        <div className="toyshop"><h3>TOY SHOP</h3></div>
        <div className="follow_us">
            <span>Follow Us</span>
            <i className="fab fa-instagram-square fa-2x"></i>
            <i className="fab fa-facebook-square fa-2x"></i>
        </div>
      </div>
    )
  }
}
