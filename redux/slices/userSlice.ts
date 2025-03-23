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
        }
    }
})

export const { setUser } = userSlice.actions;
export default userSlice.reducer;