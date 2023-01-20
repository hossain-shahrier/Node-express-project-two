require('dotenv').config()
// async errors
require('express-async-errors')

const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const productRouter = require('./routes/products')
const notFoundMiddleWare = require('./middleware/not-found')
const errorMiddleWare = require('./middleware/not-found')
// middleware
app.use(express.json())

// Routes
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">Products route</a>')
})

app.use('/api/v1/products', productRouter)
// Products route
app.use(notFoundMiddleWare)
app.use(errorMiddleWare)

// port
const port = process.env.PORT || 3000

const start = async () => {

    try {
        // ConnectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening to ${port}`))
    } catch (err) {
        console.error(err);
    }
}
start()