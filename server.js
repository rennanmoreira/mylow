import { join, dirname } from 'path'
import express from 'express'
import { fileURLToPath } from 'url'
import serveStatic from 'serve-static'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// configure dist to serve app files
app.use('/', serveStatic(join(__dirname, 'dist')))

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`)
})
