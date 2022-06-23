import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import http from '../http-common'
import Page from '../pages/Page'
import Home from '../pages/Home'
import Test from '../pages/Test'

const App = () => {
    const [titles, setTitles] = useState([])
    const [pages, setPages] = useState([])

    useEffect (() => {
      const fetchPages = async () => {
        const res = await http.get('/all_pages')
        const pages_fetched = []
        const titles_fetched = []
        res.data.forEach( page => {
            let data = {
                _id: page._id,
                title: page.title,
                order: page.order,
                cards: page.cards
            }
            pages_fetched.push(data)
            titles_fetched.push(data.title)
        })
        setTitles(titles_fetched)
        setPages(pages_fetched)
      }
      fetchPages()
    }, [])

    const get_routes = (titles, pages) => {
        var rows = []
        titles.forEach( title => {
            rows.push(<Route exact path={`/${title}`} render={() => Page({ titles, title, page: pages.find(obj => {return obj.title === title})})} key={title}/>)
        })
        return rows
    }

    const get_edit_routes = (titles, pages) => {
        var rows = []
        titles.forEach( title => {
            rows.push(<Route exact path={`/Edit/${title}`} render={() => Page({ titles, title, page: pages.find(obj => {return obj.title === title}), edit_mode: true })} key={title}/>)
        })
        return rows
    }

    return (
        <div>
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route exact path="/Test/" component={Test} />
                        <Route exact path="/" render={() => Home({ titles })} />
                        {get_routes(titles, pages)}
                        <Route exact path="/Edit/" render={() => Home({ titles, edit_mode: true })} />
                        {get_edit_routes(titles, pages)}
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    )
}

export default App