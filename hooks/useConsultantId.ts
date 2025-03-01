import { getAuth, onAuthStateChanged , User as FirebaseUser} from "firebase/auth";
import { useEffect, useState } from "react";
import { db, app } from "@/lib/firebaseConfig";

// TODO: Rename to just useCurrentUser or similar, as this is not just for consultants
export const useConsultantId = () => {
    const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    return currentUser;
}