import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setOnboardingState } from "./onboardingSlice";
import { fetchStudents } from "./studentsSlice";


export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async ({ userId, database }: { userId: string; database: string }, thunkAPI) => {
        try {
            const { dispatch } = thunkAPI
    
            const docRef = doc(db, database, userId);
            const docSnap = await getDoc(docRef);
            const userData = docSnap.data()
            console.log('Fetched user data', userData)
    
            const metaDataRef = collection(db, database, userId, "assignmentMeta")
            const metaDataSnap = await getDocs(metaDataRef)
            const assignmentMetaData = metaDataSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
    
            console.log('Fetched meta data', assignmentMetaData)
            
            dispatch(setOnboardingState({
                isComplete: userData?.onboarding.isComplete,
                onboardingStep: userData?.onboarding.onboardingStep,
            }));
                    
            return {id: docSnap.id, firstName: userData?.personalInformation.firstName, lastName: userData?.personalInformation.lastName, email: userData?.personalInformation.email, role: userData?.role, assignmentMetaData};
        } catch (error) {
            console.log('Error fetching user data:', error);
            return thunkAPI.rejectWithValue(error)
        }
    }
);

const initialState = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
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
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            return { ...state, ...action.payload };
        });
    }
})

export const { setUser, updateUser } = userSlice.actions;
export default userSlice.reducer;