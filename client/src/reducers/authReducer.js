import { createSlice } from "@reduxjs/toolkit"

const initialState = { 
    isLoggedIn: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logIn: (state, action) => {
            state.isLoggedIn = true
        }
    }
})

export const { logIn } = authSlice.actions

export default authSlice.reducer