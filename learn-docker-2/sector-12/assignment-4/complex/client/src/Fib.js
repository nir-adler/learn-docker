import React, { useReducer, useEffect } from 'react'
import axios from 'axios'

const reducer = (state, action) => {
    switch (action.type) {
        case 'update_values':
            return { ...state, values: { ...action.payload } }
        case 'update_indexes':
            return { ...state, seenIndex: [...action.payload] }
        case 'update_index':
            return { ...state, index: action.payload }
        default:
            return state
    }
}

const Fib = () => {
    const [state, dispatch] = useReducer(reducer, {
        seenIndex: [],
        values: {},
        index: ''
    })
    const fetchValues = async () => {
        const values = await axios.get('/api/values/current')
        console.log(values.data)
        console.log(Object.keys(values.data) )
        console.log( )
        dispatch({ type: 'update_values', payload: values.data })
    }

    const fetchIndexes = async () => {
        const seenIndexes = await axios.get('/api/values/all')
        dispatch({ type: 'update_indexes', payload: seenIndexes.data })
    }



    useEffect(() => {
        fetchValues()
        fetchIndexes()

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios.post('/api/values', {
            index: state.index
        })
        dispatch({ type: 'update_index', payload: '' })
        fetchValues()
        fetchIndexes()
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index:</label>
                <input
                    value={state.index}
                    onChange={(e) => dispatch({ type: 'update_index', payload: e.target.value })}
                />
                <button>submit</button>
            </form>
            <h3>indexes I have seen:</h3>
            {state.seenIndex.map(({ number }) => number + ', ')}
            <h3>Calculated Values</h3>
            {Object.keys(state.values).map((index)=><p key={index}>index: {index}, value {state.values[index]}</p>)}
        </div>
    )

}



export default Fib