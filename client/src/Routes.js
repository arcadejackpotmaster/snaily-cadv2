import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Partials
import Navbar from "./components/Partials/Navbar"
import HomePage from './components/Partials/HomePage';

// Authentication
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from "./components/Auth/PrivateRoute"


// Citizen
import CitizensPage from "./components/Citizen/CitizensPage";
import CreateCitizen from "./components/Citizen/CreateCitizen";


// Tow
import TowAuthRoute from './components/Auth/TowAuthRoute';
import Tow from "./components/Tow/Tow";
import NoAccess from './components/Partials/Messages/NoAccess';


// Bleeter
import Bleeter from "./components/Bleeter/Bleeter"

export default class Routes extends Component {
    render() {
        return (
            <Router>
                <Navbar />

                <Route path="/" exact component={HomePage} />
                <Route path="/403" exact render={() => (
                    <NoAccess message="Sorry! You don't have access to this part of the CAD. Please contact staff member." />
                )} />

                <div className="login-container">
                    <Switch basename="/">
                        {/* Auth Routes */}
                        <Route path="/auth/login" exact component={Login} />
                        <Route path="/auth/register" exact component={Register} />
                    </Switch>
                </div>


                <Switch basename="/">
                    <PrivateRoute exact path="/citizen" component={CitizensPage} />
                    <PrivateRoute exact path="/citizen/create" component={CreateCitizen} />
                </Switch>


                <Switch basename="/">
                    <TowAuthRoute exact path="/tow" component={Tow} />
                </Switch>


                <Switch basename="/">
                    <Route path="/bleeter" exact component={Bleeter} />
                </Switch>

            </Router>
        )
    }
}