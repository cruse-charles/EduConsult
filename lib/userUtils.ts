import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const updateUserPersonalInfo = async (userId, updatedInfo) => {
    const userDocRef = doc(db, "consultantUsers", userId);
    await updateDoc(userDocRef, updatedInfo)
}