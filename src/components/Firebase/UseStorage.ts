import {
	fireAddNewDoc,
	fireCreateStorageRef,
	fireGetImageUrl,
	fireUploadImage,
} from "./../../config/fire";
import "firebase/compat/firestore";
import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";

const UseStorage = (file, itemDesc, price) => {
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);
	const [url, setUrl] = useState(null);
	const imageName = itemDesc;

	useEffect(() => {
		// const storageRef = fire.storage().ref(file.name);
		const storageRef = fireCreateStorageRef(file.name);

		// const collectionRef =  fire.firestore().collection("images");

		fireUploadImage(storageRef, file).on(
			"state_changed",
			(snap) => {
				let percentage =
					(snap.bytesTransferred / snap.totalBytes) * 100;
				setProgress(percentage);
			},
			(err) => {
				setError(err);
			},
			async () => {
				// complete
				fireGetImageUrl(storageRef).then((url) => {
					fireAddNewDoc("images", {
						url,
						createdAt: Timestamp.now(),
						imageName,
						price,
					});
					setUrl(url);
				});
			}
		);

		// storageRef.put(file).on(
		// 	"state_changed",
		// 	(snap) => {
		// 		let percentage =
		// 			(snap.bytesTransferred / snap.totalBytes) * 100;
		// 		setProgress(percentage);
		// 	},
		// 	(err) => {
		// 		setError(err);
		// 	},
		// 	async () => {
		// 		const url = await storageRef.getDownloadURL();
		// 		const createdAt = firebase.firestore.Timestamp.now();
		// 		// collectionRef.add({ url, createdAt, imageName, price });

		// 		fireAddNewDoc("images", { url, createdAt, imageName, price });
		// 		setUrl(url);
		// 	}
		// );
	}, [file]);

	return { progress, url, error };
};

export default UseStorage;
