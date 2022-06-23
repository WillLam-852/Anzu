import authReducer from "./authReducer"

const combineReducers = {
    reducer: {
        auth: authReducer,
        page: pageReducer
    }
}

export default combineReducers