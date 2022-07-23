import moment from "moment";

export const converToHumanDate = (timestamp) => {
	return moment(timestamp).format("LLL");
};
