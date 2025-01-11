import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            return action.payload
        },
        removeUser() {
            return initialState
        }
    },
});

export const { setUser, removeUser } = userSlice.actions;
export const { reducer } = userSlice;
export default userSlice.reducer;