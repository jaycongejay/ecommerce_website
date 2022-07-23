import React, { useState } from "react";
import "./UploadForm.scss";
import ProgressBar from "./ProgressBar";

const UploadForm = () => {
	const [file, setFile] = useState(undefined);
	const types = ["image/png", "image/jpeg"];
	const [uploadError, setUploadError] = useState(null);
	const [itemDesc, setItemDesc] = useState<string>(undefined);
	const [price, setPrice] = useState<number>(undefined);

	const fileSelection = (e) => {
		let selected = e.target.files[0];

		if (!price || !itemDesc) {
			setUploadError("Item name and price must be provided");
			setFile(undefined);
		} else {
			if (selected && types.includes(selected.type)) {
				setFile(selected);
				setUploadError("");
			} else {
				setUploadError("Please select an image file (png or jpeg)");
				setFile(undefined);
			}
		}
	};

	const onItemDesc = (e) => {
		setItemDesc(e.target.value);
	};
	const onItemPrice = (e) => {
		setPrice(e.target.value);
	};

	return (
		<div className="uploadForm">
			<div className="form">
				<div>
					<input
						type="file"
						onChange={fileSelection}
						value={""}
						className="btn-primary"
					/>
				</div>
				<div>
					<p>Item Description</p>
					<input type="text" value={itemDesc} onChange={onItemDesc} />
				</div>
				<div>
					<p>Price</p>
					<input type="number" value={price} onChange={onItemPrice} />
				</div>

				<div className="output">
					{uploadError && <div className="error">{uploadError}</div>}
					{file && <div>{file.name}</div>}
					{file && (
						<ProgressBar
							file={file}
							itemDesc={itemDesc}
							price={price}
							setFile={setFile}
							setItemDesc={setItemDesc}
							setPrice={setPrice}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default UploadForm;
