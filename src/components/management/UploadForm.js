import React, { useState  } from 'react';
import './UploadForm.scss';
import ProgressBar from './ProgressBar';

const UploadForm = () => {
    
    const [file, setFile] = useState(null);
    const types = ['image/png', 'image/jpeg'];
    const [uploadError, setUploadError] = useState(null);
    const [imageName, setImageName] = useState("");
    const [price, setPrice] = useState(0);

  
    const fileSelection = (e) => {
        let selected = e.target.files[0];

        if(selected && types.includes(selected.type)){
            setFile(selected);
            setUploadError('');
        }   
        else{
            setFile(null);
            setUploadError('Please select an image file (png or jpeg)');
        }
    }

    const image_name = (e) => {
        setImageName(e.target.value);
    }
    const item_price = (e) => {
        setPrice(e.target.value);
    }
 


    return (
      <div className='uploadForm'>
        <div>
            <input type="file" onChange={fileSelection} className='btn-primary'/>
        </div>
        <div>
            <p>Item Name</p>
            <input type="text" onChange={image_name}/>
        </div>
        <div>
            <p>Price</p>
            <input type="number" onChange={item_price}/>
        </div>
        
        
        
        <div className="output">
            { uploadError && <div className="error">{uploadError}</div> }
            { file && <div>{file.name}</div> }
            { file && <ProgressBar file={file} setFile={setFile} imageName={imageName} setImageName={setImageName} price={price} setPrice={setPrice}/>}
        </div>
      </div>
    )
}


export default UploadForm;