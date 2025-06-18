import { doc, increment, updateDoc } from "firebase/firestore"
import { db } from "./firebaseConfig"

export const nextStep = async (consultantId: string) => {
    try {
        const consultantDocRef = doc(db, "consultantUsers", consultantId)
        
        await updateDoc(consultantDocRef, {
            "onboarding.onboardingStep": increment(1)
        })
    } catch (error) {
        console.log("Error advancing onboarding step:", error)
    }
}

export const completeOnboardingFirebase = async (consultantId: string) => {
    try {
        const consultantDocRef = doc(db, "consultantUsers", consultantId)
        
        await updateDoc(consultantDocRef, {
            "onboarding.isComplete": true
        })
    } catch (error) {
        console.log("Error advancing onboarding step:", error)
    }
}