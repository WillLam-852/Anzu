import authReducer from "./authReducer"
import pagesReducer from "./pagesReducer"

const combineReducers = {
    reducer: {
        auth: authReducer,
        pages: pagesReducer
    }
}

export default combineReducers