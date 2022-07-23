import React from "react";
import UploadForm from "./UploadForm";
import "./Management.scss";
import UsersInfo from "./UsersInfo";

const Management = () => {
	return (
		<div className="manager_container">
			<UploadForm />
			<UsersInfo />
		</div>
	);
};

export default Management;
