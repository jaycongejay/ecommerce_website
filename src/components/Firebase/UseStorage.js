import { useState, useEffect } from 'react';
import {fire, timestamp} from "../../config/fire";

const UseStorage = (file, imageName, price, setImageName, setPrice) => {

    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);

    useEffect(() => {
        const storageRef = fire.storage().ref(file.name);
        const collectionRef = fire.firestore().collection('images');
        

        storageRef.put(file).on('state_changed', (snap) => {
            let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
            setProgress(percentage);
        }, (err) => {
            setError(err);
        }, async () => {
            const url = await storageRef.getDownloadURL();
            const createdAt = timestamp();
            collectionRef.add({ url, createdAt, imageName, price });
            setUrl(url);
            setImageName(null);
            setPrice(null)
        })
        
    }, [file])

    return { progress, url, error }
}


export default UseStorage;