import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const updateUserPersonalInfo = async (userId: string, updatedInfo: {firstName: string, lastName: string, email: string}) => {
    try {
        const userDocRef = doc(db, "consultantUsers", userId);
        await updateDoc(userDocRef, updatedInfo)
    } catch (error) {
        console.log('error', error)
    }
}