import axios from 'axios';
import { useReducer, useEffect } from 'react';

const useFetchJobs = (params, page) => {

    // Actions
    const ACTIONS = {
        MAKE_REQUEST: 'make-request',
        GET_DATA: 'get-data',
        ERROR: 'error'
    }

    // CORs proxy https://cors-anywhere.herokuapp.com/
    const githubURL = 'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json';

    // Reducer
    function reducer(state, action) {
        switch(action.type) {
            case ACTIONS.MAKE_REQUEST:
                return { loading: true, jobs: []};
            case ACTIONS.GET_DATA:
                return { ...state, loading: false, jobs: action.payload.jobs };
            case ACTIONS.ERROR: 
                return { ...state, loading: false, error: action.payload.error, jobs: [] };
            default:
                return state;
        }
    }
    
    const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true }); // second argument is initial state

    // Dispatch
    useEffect(() => {
        const cancelToken = axios.CancelToken.source() // prevents tons of axious requests from being made whenever params change

        dispatch({ type: ACTIONS.MAKE_REQUEST });
        axios.get(githubURL, {
            cancelToken: cancelToken.token,
            params: {markdown: true, page: page, ...params }
        }).then(res => {
            dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } })
        }).catch(error => {
            if (axios.isCancel(error)) return 
            dispatch({ type: ACTIONS.ERROR, payload: { error: error } })
        })

        return () => {
            cancelToken.cancel(); // this calls the .catch so there needs to be a if statement
        }
    }, [params, page]);

    return state;
}

export default useFetchJobs;