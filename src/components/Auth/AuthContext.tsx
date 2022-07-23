import React, { createContext, useEffect, useState } from "react";
import { fire } from "../../config/fire";

export const AuthContext = createContext<any>(undefined);

export const AuthProvider = (props: any) => {
    const [user, setUser] = useState<Object | undefined>({});

    useEffect(() => {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(undefined);
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={[user, setUser]}>
            {props.children}
        </AuthContext.Provider>
    );
};
