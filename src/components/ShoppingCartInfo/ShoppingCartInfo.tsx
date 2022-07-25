import React, { createContext, useContext, useEffect, useState } from "react";

export const ShoppingCartInfoContext = createContext<any>(undefined);

export const ShoppingCartInfoProvider = (props: any) => {
	const [toggleUserShoppingCart, setToggleUserShoppingCart] =
		useState<boolean>(false);

	return (
		<ShoppingCartInfoContext.Provider
			value={[toggleUserShoppingCart, setToggleUserShoppingCart]}
		>
			{props.children}
		</ShoppingCartInfoContext.Provider>
	);
};
