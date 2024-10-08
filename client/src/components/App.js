import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import { savePages } from '../reducers/pagesReducer'
import http from '../http-common'
import Page from '../pages/Page'
import Home from '../pages/Home'
import NewPage from '../pages/NewPage'

const App = () => {
    const [titles, setTitles] = useState([])

    const dispatch = useDispatch()

    useEffect (() => {
      const fetchPages = async () => {
        const res = await http.get('/all_pages')
        const pages_fetched = []
        const titles_fetched = []
        res.data.forEach( page => {
            let data = {
                _id: page._id,
                title: page.title,
                banner_image: page.banner_image,
                button_image: page.button_image,
                cards: page.cards
            }
            pages_fetched.push(data)
            titles_fetched.push(data.title)
        })
        setTitles(titles_fetched)
        dispatch(savePages({ 
            pages: pages_fetched,
            titles: titles_fetched
        }))
      }
      fetchPages()
    }, [dispatch])

    const get_routes = (titles) => {
        var rows = []
        titles.forEach( title => {
            rows.push(<Route path={`/${encodeURIComponent(title.replace(/(\r\n|\n|\r)/gm, ''))}`} element={<Page />} key={title}/>)
            rows.push(<Route path={`/Edit/${encodeURIComponent(title.replace(/(\r\n|\n|\r)/gm, ''))}`} element={<Page />} key={`Edit/${title}`}/>)
        })
        return rows
    }

    return (
        <BrowserRouter>
            <Helmet>
                <title>Anzu</title>
            </Helmet>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Edit/" element={<Home />} />
                <Route path="/Edit/New_page/" element={<NewPage />} />
                {get_routes(titles)}
            </Routes>
        </BrowserRouter>
    )
}

export default App