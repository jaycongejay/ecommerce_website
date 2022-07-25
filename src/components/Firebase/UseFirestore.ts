import { useState, useEffect } from "react";
import { fireGetDocs } from "../../config/fire";

const UseFirestore = (collection) => {
	const [docs, setDocs] = useState<any[]>();

	useEffect(() => {
		// const unsub = fire
		// 	.firestore()
		// 	.collection(collection)
		// 	.orderBy("createdAt", "desc")
		// 	.onSnapshot((snap) => {
		// 		let documents = [];
		// 		snap.forEach((doc) => {
		// 			documents.push({ ...doc.data(), id: doc.id });
		// 		});
		// 		setDocs(documents);
		// 	});

		// return () => unsub();

		const unsub = fireGetDocs(collection).then((snap) => {
			let documents = [];
			snap.forEach((doc) => {
				documents.push({ ...doc.data(), id: doc.id });
			});
			setDocs(documents);
		});
	}, [collection]);

	return { docs };
};

export default UseFirestore;
