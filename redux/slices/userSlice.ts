import { createSlice } from "@reduxjs/toolkit";

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
        }
    }
})

export const { setUser, updateUser } = userSlice.actions;
export default userSlice.reducer;