import React, {  useEffect, useState, createContext } from 'react';
import {fire} from "../../config/fire";



export const AuthContext = createContext();

export const AuthProvider = props => {

    const [user, setUser] = useState({})


    useEffect(() => {
        fire.auth().onAuthStateChanged(user => {
            if(user){
                setUser(user);
            }
            else{
                setUser(null);

            }
        })
    }, [])


    return (
        <AuthContext.Provider value={[user, setUser]}>
            {props.children}
        </AuthContext.Provider>
    )
}
