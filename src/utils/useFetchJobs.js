import axios from 'axios';
import { useReducer, useEffect } from 'react';

const useFetchJobs = (params, page) => {

    // Actions
    const ACTIONS = {
        MAKE_REQUEST: 'make-request',
        GET_DATA: 'get-data',
        ERROR: 'error',
        UPDATE_HAS_NEXT_PAGE: 'update-has-next-page'
    }

    // CORs proxy https://cors-anywhere.herokuapp.com/
    const githubURL = 'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json';

    // Reducer
    function reducer(state, action) {
        switch(action.type) {
            case ACTIONS.MAKE_REQUEST:
                return { loading: true, jobs: [] };
            case ACTIONS.GET_DATA:
                return { ...state, loading: false, jobs: action.payload.jobs };
            case ACTIONS.ERROR: 
                return { ...state, loading: false, error: action.payload.error, jobs: [] };
            case ACTIONS.UPDATE_HAS_NEXT_PAGE:
                return { ...state, hasNextPage: action.payload.hasNextPage };
            default:
                return state;
        }
    }
    
    const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true }); // second argument is initial state

    // Dispatch
    useEffect(() => {
        const cancelToken1 = axios.CancelToken.source() // prevents tons of axious requests from being made whenever params change
        const cancelToken2 = axios.CancelToken.source()

        dispatch({ type: ACTIONS.MAKE_REQUEST });

        axios.get(githubURL, {
            cancelToken: cancelToken1.token,
            params: {markdown: true, page: page, ...params }
        }).then(res => {
            dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } })
        }).catch(error => {
            if (axios.isCancel(error)) return; 
            dispatch({ type: ACTIONS.ERROR, payload: { error: error } })
        })

        axios.get(githubURL, {
            cancelToken: cancelToken2.token,
            params: {markdown: true, page: page + 1, ...params }
        }).then(res => {
            dispatch({ type: ACTIONS.UPDATE_HAS_NEXT_PAGE, payload: { hasNextPage: res.data.length !== 0 } })
        }).catch(error => {
            if (axios.isCancel(error)) return; 
            dispatch({ type: ACTIONS.ERROR, payload: { error: error } })
        })

        return () => {
            cancelToken1.cancel(); // this return calls the .catch so there needs to be a if statement
            cancelToken2.cancel();
        }
    }, [params, page]);

    return state;
}

export default useFetchJobs;