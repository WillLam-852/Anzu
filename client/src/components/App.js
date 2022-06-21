import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ResponsiveAppBar from './ResponsiveAppBar'
import Home from '../pages/Home'
import TeaCeremony from '../pages/TeaCeremony'
import Ikebana from '../pages/Ikebana'
import Wagashi from '../pages/Wagashi'
import Yukata from '../pages/Yukata'
import ComingSoon from '../pages/ComingSoon'
import EditPage from '../pages/Edit'

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <div>
                    <ResponsiveAppBar />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/TeaCeremony" component={TeaCeremony} />
                        <Route exact path="/Ikebana" component={Ikebana} />
                        <Route exact path="/Wagashi" component={Wagashi} />
                        <Route exact path="/Yukata" component={Yukata} />
                        <Route exact path="/ComingSoon" component={ComingSoon} />
                        <Route exact path="/Edit" component={EditPage} />
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    )
}

export default App