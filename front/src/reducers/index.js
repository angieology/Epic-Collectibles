
const Reducer=(state, action)=> {
    switch(action.type){
        case 'UPDATE_STORE':
            const { fetchTokens, isLoading, mintToken, owner, tokens } = action.payload
            return { ...state, fetchTokens, isLoading, mintToken, owner, tokens};  
        case 'SET_TOKENS':
            return { ...state,
                tokens: action.payload
            }
        default : return state
    }
}

export default Reducer;
