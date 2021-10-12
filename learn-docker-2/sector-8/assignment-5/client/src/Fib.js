import React, { useReducer, useEffect } from 'react'
import axios from 'axios'



const reducer = (state, action) => {
    switch (action.type) {
        case 'update_values':
            return { ...state, values: [...action.payload] }
        case 'update_indexes':
            return { ...state, seenIndexes: [...action.payload] }
        case 'update_index':
            return { ...state, index: action.payload }
        default:
            return state
    }
}

const Fib = () => {
    const [state, dispatch] = useReducer(
        reducer,
        {
            seenIndexes: [],
            values: [],
            index: ''
        })
    const fetchValues = async () => {
        const values = await axios.get('/api/values/current')
        const valuesArray = []
        const keys=Object.keys(values.data)
        keys.forEach((key)=>{
            valuesArray.push({
                index: key,
                result: values.data[key]
            })

        })
        console.log(valuesArray)
        dispatch({ type: 'update_values', payload: valuesArray })
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
        try {

            await axios.post('/api/values', {
                index: state.index
            })
            dispatch({ type: 'update_index', payload: '' })
            fetchValues()
            fetchIndexes()

        } catch (e) {
            console.log(e)
        }
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
            <h3>Indexes I have seen:</h3>
            {state.seenIndexes.map(({ number }) => number).join(', ')}
            <h3>Calculated Values:</h3>
            {state.values.map((item) => <p key={item.index}>index: {item.index}, result: {item.result}</p>)}
        </div>
    )

}


export default Fib