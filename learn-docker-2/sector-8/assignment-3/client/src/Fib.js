import React, { useReducer, useEffect } from 'react'
import axios from 'axios'

const reducer = (state, action) => {
    switch (action.type) {
        case 'update_values':
            return { ...state, values: { ...action.payload } }
        case 'update_indexes':
            return { ...state, seenIndexes: [...action.payload] }
        case 'update_index':
            return { ...state, index: action.payload }
        default:
            return state
    }
}


const Fib = () => {
    const [state, dispatch] = useReducer(reducer, {
        values: {},
        seenIndexes: [],
        index: ''
    })


    useEffect(() => {
        const fetchValues = async () => {
            const values = await axios.get('/api.values/current')
            dispatch({ type: 'update_values', payload: values.data })
        }
        const fetchIndexes = async () => {
            const seenIndexes = await axios.get('/api/values/all')
            dispatch({ type: 'update_indexes', payload: seenIndexes.data })
        }
        fetchValues()
        fetchIndexes()

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        await axios.post('/api/values', {
            index: state.index
        })
        dispatch({ type: 'update_index', payload: '' })

    }

    return (
        <div>
            <form onsubmit={handleSubmit}>
                <label>Enter your index:</label>
                <input
                    value={state.index}
                    onChange={(index) => dispatch({ type: 'update_index', payload: index })}
                />
                <button>submit</button>
            </form>
            <h3>Indexes I have seen:</h3>
            {state.seenIndexes.map(({ number }) => number).join(', ')}
            <h3>Calculated Values:</h3>
            {state.values.toString()}
        </div>
    )

}

export default Fib