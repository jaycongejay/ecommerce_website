import React, { useEffect } from "react";
import UseStorage from "../Firebase/UseStorage";
import "./ProgressBar.scss";

const ProgressBar = (props) => {
	const { file, itemDesc, price, setFile, setItemDesc, setPrice } = props;
	const { url, progress } = UseStorage(file, itemDesc, price);

	useEffect(() => {
		if (url) {
			setFile(undefined);
			setItemDesc("");
			setPrice("");
		}
	}, [url, setFile]);

	return (
		<div className="progress_bar" style={{ width: progress + "%" }}></div>
	);
};

export default ProgressBar;
