import express from "express"
import url from "url"
import path from "path"
import dotenv from "dotenv"
import "colors"
dotenv.config()
const PORT = process.env.PORT
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.listen(PORT, () => {
    console.log("Server is Running".green)
})