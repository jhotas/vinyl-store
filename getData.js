import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'

async function getData() {
    const db = await open({
        filename: path.join('database.db'),
        driver: sqlite3.Database
    })

    try {
        const query = 'SELECT * FROM products WHERE genre = ?'
        const params = ['rock']

        const products = await db.all(query, params)
        console.log(products)
    } catch (error) {
        console.log(error)
    }
}

getData()