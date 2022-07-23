import { useState, useEffect } from "react";
import { fire } from "../../config/fire";

const UseFirestore = (collection) => {
	const [docs, setDocs] = useState<any[]>();

	useEffect(() => {
		const unsub = fire
			.firestore()
			.collection(collection)
			.orderBy("createdAt", "desc")
			.onSnapshot((snap) => {
				let documents = [];
				snap.forEach((doc) => {
					documents.push({ ...doc.data(), id: doc.id });
				});
				setDocs(documents);
			});

		return () => unsub();
	}, [collection]);

	return { docs };
};

export default UseFirestore;
