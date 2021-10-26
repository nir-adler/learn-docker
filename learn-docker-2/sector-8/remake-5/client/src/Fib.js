import * as React from 'react'
import axios from 'axios'

const reducer = (state, action) => {
    switch (action.type) {
        case 'update_saved':
            return { ...state, saved: [...action.payload] }
        case 'update_temp':
            return { ...state, temp: { ...action.payload } }
        case 'error':
            return { ...state, error: action.payload }
        default:
            return state
    }
}

const Fib = () => {
    const [state, dispatch] = React.useReducer(reducer, {
        number: null,
        saved: [],
        temp: {},
        error: null
    })

    React.useEffect(() => {
        const form = document.querySelector('form')
        const input = form.querySelector('input')
        form.addEventListener('submit', async (e) => {
            e.preventDefault()

            try {
                await axios.get(`http://127.0.0.1:8081/addvalue/${input.value}`)
                apiSaved()
                apiTemp()
                // dispatch({ type: 'error', payload: null })
                // console.log(response.data)
            } catch (error) {
                console.log('here3')
                // console.log(error.response.data)
                if (error && error.response && error.response.data) {
                   
                    dispatch({ type: 'error', payload: error.response.data.error })
                } else if (error && error.name) {
                
                    dispatch({ type: 'error', payload: error.name })

                }else{
                    dispatch({ type: 'error', payload: error })
                }

            }

        })
        console.log('event')

        const apiSaved = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8081/saved')
                dispatch({ type: 'update_saved', payload: response.data })
            } catch (e) {
                console.log(e)
            }
        }
        const apiTemp = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8081/temp')
                dispatch({ type: 'update_temp', payload: response.data })
            } catch (e) {
                console.log(e)
            }
        }

        apiSaved()
        apiTemp()

    }, [])

    return (
        <div id='fib-body'>
            <form>
                {/* <label for='number'>Enter number for fib:</label> */}
                <p>Enter number for fib:</p>
                <input type='text' />
                <input type='submit' />
            </form>

            <div>
                <p>number that been type:</p>
                {state.saved.map((save) => `${save.number},`)}
            </div>
            <div>
                <p>results:</p>
                {Object.keys(state.temp).map((key) => <p key={key.toString()}>number: {key}, result: {state.temp[key]}</p>)}

            </div>
            {state.error ? <p>{state.error}</p> : null}
        </div>
    )
}


export default Fib