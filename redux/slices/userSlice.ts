import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setOnboardingState } from "./onboardingSlice";
import { AssignmentMetaData, UserState } from "@/lib/types/types";

// Async thunk to fetch user data
export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async ({ userId, database }: { userId: string; database: string }, thunkAPI) => {
        try {
            const { dispatch } = thunkAPI
    
            // Fetch user data from Firestore
            const docRef = doc(db, database, userId);
            const docSnap = await getDoc(docRef);
            const userData = docSnap.data()
    
            // Fetch assignment metadata for the user
            const metaDataRef = collection(db, database, userId, "assignmentMeta")
            const metaDataSnap = await getDocs(metaDataRef)

            const assignmentsMetaData: Record<string, AssignmentMetaData> = {}
            metaDataSnap.docs.forEach(doc => {
                assignmentsMetaData[doc.id] = doc.data() as AssignmentMetaData
            })
    
    
            // Dispatch onboarding state to redux
            dispatch(setOnboardingState({
                isComplete: userData?.onboarding.isComplete,
                onboardingStep: userData?.onboarding.onboardingStep,
            }));
                    
            // return {id: docSnap.id, firstName: userData?.personalInformation.firstName, lastName: userData?.personalInformation.lastName, email: userData?.personalInformation.email, role: userData?.role, assignmentsMetaData};
            return {id: docSnap.id, ...userData, assignmentsMetaData};
        } catch (error) {
            console.log('Error fetching user data:', error);
            return thunkAPI.rejectWithValue(error)
        }
    }
);

const initialState: UserState = {
    id: '',
    personalInformation: {
        firstName: '',
        lastName: '',
    },
    email: '',
    role: '',
    assignmentDocIds: [],
    folders: [],
    assignmentsMetaData: {}
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            return action.payload;
        },
        updateUser(state, action) {
            return {...state, ...action.payload}
        },
        readAssignmentUserSlice(state, action) {
            const assignmentMetaData = state.assignmentsMetaData[action.payload]
            if (assignmentMetaData) {
                assignmentMetaData.hasRead = true
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            return { ...state, ...action.payload };
        });
    }
})

export const { setUser, updateUser, readAssignmentUserSlice } = userSlice.actions;
export default userSlice.reducer;