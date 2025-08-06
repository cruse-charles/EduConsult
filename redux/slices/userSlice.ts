import { db } from "@/lib/firebaseConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (studentId: string) => {
        const docRef = doc(db, "studentUsers", studentId);
        const docSnap = await getDoc(docRef);
        console.log('data from fetchUser thunk:', docSnap.data());
        const docData = docSnap.data()
        return {id: docSnap.id, firstName: docData?.personalInformation.firstName, lastName: docData?.personalInformation.lastName, email: docData?.email, role: 'student'};
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