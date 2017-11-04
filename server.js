const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

const routes = require('./routes')
const handle = routes.getRequestHandler(app)

const app_port = 5000

import { prefix } from '@/utils/constants';

app.prepare().then(() => {
  const server = express()
  const router = express.Router()

  router.get('/news/:sortBy?/', (req, res) => {
    return app.render(req, res, '/index', req)
  })

  router.get('*', (req, res) => {
    return handle(req, res)
  })

  // use next routes
  server.use(`${prefix}`, router)
  server.use(`${prefix}/static`, express.static('static'))
  server.use(handle)

  server.listen(app_port, err => {
    if (err) {
      throw err
    }
    console.log(`> Ready on http://localhost:${app_port}${prefix}`)
  })
})
