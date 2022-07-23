import React from "react";
import "./errorPage.scss";

interface ErrorPageProps {
	errMsg: string;
}

const ErrorPage = (props: ErrorPageProps) => {
	const { errMsg } = props;
	return (
		<div className="errorPage">
			<div className="imageContainer">
				<img
					className="rounded-full"
					src="/logo_secondary.svg"
					width={200}
					height={"auto"}
					alt={"toyshopLogo"}
				/>
			</div>
			<div className="msgContainer">
				<div className="title">Sorry</div>
				<div className="message">{errMsg}</div>
			</div>
		</div>
	);
};

export default ErrorPage;
