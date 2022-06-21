import authReducer from "./authReducer"

const combineReducers = {
    reducer: {
        auth: authReducer
    }
}

export default combineReducers