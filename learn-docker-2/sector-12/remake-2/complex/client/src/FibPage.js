import React, { useEffect, useState, useReducer } from 'react'
import axios from 'axios'

const reducer = (state, action) => {
    switch (action.type) {
        case 'fetch_save_values':
            return { ...state, saveValues: [...action.payload] }
        case 'fetch_temp_values':
            return { ...state, tempValues: { ...action.payload } }
        case 'update_number':
            return { ...state, number: action.payload }

        default:
            return state
    }
}


const FibPage = () => {
    const [state, dispatch] = useReducer(reducer, {
        number: '',
        tempValues: {},
        saveValues: []
    })

    const fetchSaveValues = async () => {
        try {
            // console.log('here')
            const { data } = await axios.get('/api/savevalues')
            // console.log(data)
            dispatch({ type: 'fetch_save_values', payload: [...data] })
        } catch (e) {
            console.log(e)
        }
    }
    const fetchTempValues = async () => {
        try {
            // console.log('here')
            const { data } = await axios.get('/api/tempvalues')
            // console.log(data)
            dispatch({ type: 'fetch_temp_values', payload: { ...data } })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchSaveValues()
        fetchTempValues()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const number = document.querySelector('#number').value
        try {
            const { status } = await axios.post('/api/value', {
                number
            })
            if (status === 202) {
                fetchSaveValues()
                fetchTempValues()
            }
        } catch (e) {
            console.log(e.response.data)
        }

    }

    return <div>
        <form onSubmit={handleSubmit}>
            <input
                type='text'
                value={state.number}
                onChange={(e) => dispatch({ type: 'update_number', payload: e.target.value })}
                id='number'
            />
            <input type='submit' name='submit' />
        </form>
        <p>Enterd numbers</p>
        {state.saveValues.map(({ number }) => <span key={number}>{number}, </span>)}
        <p>results</p>
        {
            Object.keys(state.tempValues)
                .map((number) => <p key={number}>number:{number}, result:{state.tempValues[number]}</p>)
        }
    </div>
}


export default FibPage