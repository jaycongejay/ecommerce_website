import React, {  useEffect } from 'react';
import UseStorage from '../Firebase/UseStorage';
import './ProgressBar.scss';

const ProgressBar = ({ file, setFile, imageName, setImageName, price, setPrice }) => {

    const { url, progress } = UseStorage(file, imageName, price, setImageName, setPrice);
    
    useEffect(() => {
        if(url){
            setFile(null);
        }
    }, [url, setFile])
 


    return (
        <div className="progress_bar" style={{ width: progress + '%'}}></div>
    )
}


export default ProgressBar;