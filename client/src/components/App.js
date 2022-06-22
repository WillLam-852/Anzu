import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ResponsiveAppBar from './ResponsiveAppBar'
import Home from '../pages/Home'
import EditPage from '../pages/Edit'

const App = () => {
    const [titles, setTitles] = useState([])
    const [pages, setPages] = useState([])

    useEffect (() => {
      const fetchTitles = async () => {
        const res = await fetch('/api/all_pages/titles', {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        const json = await res.json()
        setTitles(json.titles)
      }

      const fetchPages = async () => {
        const res = await fetch('/api/all_pages', {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
        })
        const pages = []
        const json = await res.json()
        json.forEach( page => {
            let data = {
                _id: page._id,
                title: page.title,
                order: page.order,
                cards: page.cards
            }
            pages.push(data)
        })
        setPages(pages)
      }

      fetchTitles()
      fetchPages()
    }, [])

    const get_routes = (titles, pages) => {
        var rows = []
        titles.forEach( title => {
            rows.push(<Route exact path={`/${title}`} render={() => Home({ title, pages: pages.find(obj => {return obj.title === title}) })} key={title}/>)
        })
        return rows
    }

    return (
        <div>
            <BrowserRouter>
                <div>
                    <ResponsiveAppBar titles={titles} />
                    <Switch>
                        <Route exact path="/" render={() => Home({ title: 'Anzu', pages: pages.find(obj => {return obj.title === 'Anzu'}) })} />
                        {get_routes(titles, pages)}
                        <Route exact path="/Edit" render={() => EditPage()} />
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    )
}

export default App