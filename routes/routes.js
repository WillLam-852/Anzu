module.exports = (app) => {
    
    app.get('/', (req, res) => {
        res.send({ page: 'main' })
    })

    app.get('/Tea_ceremony', (req, res) => {
        res.send({ page: 'Tea_ceremony' })
    })

    app.get('/Ikebana', (req, res) => {
        res.send({ page: 'Ikebana' })
    })

    app.get('/Wagashi', (req, res) => {
        res.send({ page: 'Wagashi' })
    })

    app.get('/Yukata', (req, res) => {
        res.send({ page: 'Yukata' })
    })

}