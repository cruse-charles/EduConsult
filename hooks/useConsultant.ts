import { getAuth, onAuthStateChanged , User as FirebaseUser} from "firebase/auth";
import { useEffect, useState } from "react";
import { db, app } from "@/lib/firebaseConfig";

// TODO: Check if this is being used, if not, delete
export const useConsultant = () => {
    const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            // console.log('current User', user)
        });
        return () => unsubscribe();
    }, []);

    return currentUser;
}