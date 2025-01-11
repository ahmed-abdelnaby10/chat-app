import { createSlice } from '@reduxjs/toolkit';

const initialState = false;

const authSlice = createSlice({
    name: 'isAuthenticated',
    initialState,
    reducers: {
        setIsAuthenticated(state, action) {
            return action.payload;
        },
    },
});

export const { setIsAuthenticated } = authSlice.actions;
export const { reducer } = authSlice;
export default authSlice.reducer;