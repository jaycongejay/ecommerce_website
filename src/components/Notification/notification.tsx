import { Alert, AlertColor, Snackbar, SnackbarOrigin } from "@mui/material";
import React from "react";

interface NotificationMuiProps {
	isOpen: boolean;
	onClose: () => void;
	message: string;
	duration?: number;
	position?: SnackbarOrigin;
	type: AlertColor;
}

const NotificationMui = (props: NotificationMuiProps) => {
	const {
		isOpen,
		onClose,
		message,
		duration = 6000,
		position = { vertical: "bottom", horizontal: "left" },
		type,
	} = props;
	return (
		<Snackbar
			open={isOpen}
			autoHideDuration={duration}
			onClose={onClose}
			anchorOrigin={position}
			style={{ marginTop: "60px" }}
		>
			<Alert onClose={onClose} severity={type} sx={{ width: "100%" }}>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default NotificationMui;
