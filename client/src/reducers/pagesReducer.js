import { createSlice } from "@reduxjs/toolkit"

const initialState = { 
    pages: [],
    titles: []
}

export const pagesSlice = createSlice({
    name: 'pages',
    initialState,
    reducers: {
        savePages: (state, action) => {
            state.pages = action.payload.pages
            state.titles = action.payload.titles
        }
    }
})

export const { savePages } = pagesSlice.actions

export default pagesSlice.reducer