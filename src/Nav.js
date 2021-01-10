import React from 'react'
import {Link} from 'react-router-dom'
import './App.css'
 
export default function Nav(){
    return(
        <div id = 'nav'>
            <div id = 'menu'>
                <ul>
                    <li id = 'logo'>LOGO</li>
                    <li><Link to = "/"> Battleship</Link></li>
                    <li><Link to = "/page-two">Page Two</Link></li>
                    <li><Link to = "/page-three">Page Three</Link></li>
                </ul>

            </div>
        </div>
    )
}