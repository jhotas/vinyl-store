import { getDBConnection } from "../db/db.js"

export async function getGenres(req, res) {
    await getDBConnection()

    try {
        
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch genres', details: error.message})
    }
}

export async function getProducts() {
    console.log('products')
}