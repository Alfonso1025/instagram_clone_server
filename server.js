const express = require('express')
const app = express()
const cors = require('cors')
const swaggerDocs = require('./swagger')


app.use(express.json())
app.use(cors())

swaggerDocs(app)
app.use('/authentication', require('./routes/authentication'))
app.use('/dashboard', require('./routes/dashboard'))
app.use('/userPost', require('./routes/userPost'))
app.use('/comments', require('./routes/comments'))
app.use('/chat', require('./routes/chat'))




module.exports = app