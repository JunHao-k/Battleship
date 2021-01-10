import React from 'react'
import './App.css'

export default function Alert(props){
    return(
        <React.Fragment>
            <div class = 'alert'>
                {props.message}
            </div>
        </React.Fragment>
    )
}