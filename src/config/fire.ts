import firebase from "firebase/compat/app";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import {
	getFirestore,
	collection,
	query,
	getDoc,
	getDocs,
	doc,
	addDoc,
	orderBy,
	deleteDoc,
	updateDoc,
} from "firebase/firestore";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";

const fireApp = firebase.initializeApp({
	apiKey: process.env.REACT_APP_FIRE_API_KEY,
	authDomain: "ecommerce-website-7d69b.firebaseapp.com",
	databaseURL: "https://ecommerce-website-7d69b.firebaseio.com",
	projectId: "ecommerce-website-7d69b",
	storageBucket: "ecommerce-website-7d69b.appspot.com",
	messagingSenderId: process.env.REACT_APP_FIRE_MSG_SENDERID,
	appId: process.env.REACT_APP_FIRE_APPID,
	measurementId: process.env.REACT_APP_FIRE_MEASUREID,
});

export const fireAuth = getAuth(fireApp);
export const fireSignIn = signInWithEmailAndPassword;
export const fireCreateUser = createUserWithEmailAndPassword;
export const fireSignOut = signOut;
export const fireQuery = query;
export const fireDB = getFirestore(fireApp);
export const fireStorage = getStorage(fireApp);

export const fireAddNewDoc = async (
	path: string, // collection
	data: any
) => {
	const dbRef = collection(fireDB, path);
	return await addDoc(dbRef, data);
};
export const fireGetDoc = async (
	path: string, // collection
	docID: string
) => {
	return await getDoc(doc(fireDB, path, docID));
};
export const fireGetDocs = async (
	path: string // collection
) => {
	const fireQuery = query(
		collection(fireDB, path),
		orderBy("createdAt", "desc")
	);

	return await getDocs(fireQuery);
};
export const fireDeleteDoc = async (
	path: string, // collection
	docID: string
) => {
	return await deleteDoc(doc(fireDB, path, docID));
};
export const fireUpdateDoc = async (
	path: string, // collection
	docID: string,
	data: any
) => {
	return await updateDoc(doc(fireDB, path, docID), data);
};
export const fireCreateStorageRef = (fileName: string) => {
	return ref(fireStorage, fileName);
};
export const fireUploadImage = (storageRef: any, file: any) => {
	return uploadBytesResumable(storageRef, file);
};
export const fireGetImageUrl = async (storageRef: any) => {
	return await getDownloadURL(storageRef);
};
