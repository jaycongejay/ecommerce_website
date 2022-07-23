import { LinearProgress } from "@material-ui/core";
import React from "react";
import "./loader.scss";

const Loader = () => {
	return <LinearProgress className="loader" color="secondary" />;
};

export default Loader;
