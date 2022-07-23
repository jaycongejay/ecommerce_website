import React from "react";
import ImageGrid from "./ImageGrid";
import "./Item.scss";

const Item = (props) => {
	return (
		<div className="item_container">
			<ImageGrid search={props.match.params.txt} />
		</div>
	);
};

export default Item;
