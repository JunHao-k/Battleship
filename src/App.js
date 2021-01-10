import React from 'react';
import './App.css'
import Game from './Game.js'
//import PageTwo from './PageTwo.js'
//import PageThree from './PageThree.js'
//import Nav from './Nav.js'

/*
import{
  BrowserRouter as Router,
  Switch,
  Route, 
  Link,
}from 'react-router-dom'
*/
function App() {
  return (
    <div>
      <Game/>
      {/*  This part is commented out cause we do not want the Navbar   */ }
      {
        /*
      <Router>
          <Nav/>
        <Switch>

          <Route path = "/" exact>
            
          </Route>

          <Route path = "page-two" exact>
            <PageTwo></PageTwo>
          </Route>

          <Route path = "page-three" exact>
            <PageThree></PageThree>
          </Route>

        </Switch>
      </Router>
      */
      } 
      
    </div>
  );
}

export default App;
