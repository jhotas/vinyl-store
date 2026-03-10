import { getDBConnection } from "../db/db.js"

export async function getGenres(req, res) {
    try {
        const db = await getDBConnection()

        const genreRows = await db.all('SELECT DISTINCT genre FROM products')
        const genres = genreRows.map(row => row.genre)
        res.json(genres)
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch genres', details: error.message})
    }
}

export async function getProducts() {
    console.log('products')
}