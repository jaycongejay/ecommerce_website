# eCommerce website

    Main Functionality
        LogIn - (Firebase Authentication)
        LogOut - (Firebase Authentication)
        Create User Account - (Firebase Authentication)
        Create, Read, Update, Delete shopping item - (Firebase Cloud Firestore)
        Check out shopping items
        Payment
        Control access

## Skills used

    React, Firebase

<img src="https://img.icons8.com/plasticine/50/000000/react.png"/><img src="https://img.icons8.com/color/48/000000/javascript.png"/><img src="https://img.icons8.com/color/48/000000/html-5.png"/><img src="https://img.icons8.com/color/48/000000/css3.png"/><img src="https://img.icons8.com/color/48/000000/redux.png"/><img src="https://img.icons8.com/color/48/000000/firebase.png"/>

<a href="https://icons8.com/icon/NfbyHexzVEDk/react">React icon by Icons8</a>

<a href="https://icons8.com/icon/108784/javascript" style="font-size: 10px">JavaScript icon by Icons8</a>

<a href="https://icons8.com/icon/20909/html-5">Html 5 icon by Icons8</a>

<a href="https://icons8.com/icon/21278/css3">CSS3 icon by Icons8</a>

<a href="https://icons8.com/icon/jD-fJzVguBmw/redux">Redux icon by Icons8</a>

<a href="https://icons8.com/icon/62452/firebase">Firebase icon by Icons8</a>

## Setup

# 1) create a folder under src called config, then create a file fire.ts

import firebase from "firebase";

export const fire = firebase.initializeApp({
apiKey: "---",
authDomain: "---",
databaseURL: "---",
projectId: "---",
storageBucket: "---",
messagingSenderId: "---",
appId: "---",
measurementId: "---"
})
