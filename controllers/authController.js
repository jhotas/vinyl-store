import validator from 'validator'
import bcrypt from 'bcryptjs'
import { getDBConnection } from '../db/db.js'

export async function registerUser(req, res) {
    let { name, email, username, password } = req.body

    if (!name || !email || !username || !password) {
        return res.status(400).json({ error: 'All fields are required.' })
    }

    name = name.trim()
    email = email.trim()
    username = username.trim()

    if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {
        return res.status(400).json({ error: 'Username must be 1-20 characters, using letters, numbers, _ or -.' })
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' })
    }

    try {
        const db = await getDBConnection()
        
        const existingUser = await db.get(
            'SELECT username, email FROM users WHERE username = ? OR email = ?',
            [username, email]
        )
        
        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(409).json({ error: 'Username already taken.' })
            }
            if (existingUser.email === email) {
                return res.status(409).json({ error: 'Email already registered.' })
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const result = await db.run(
            'INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)',
            [name, email, username, hashedPassword]
        )
        req.session.userId = result.lastID

        return res.status(201).json({ message: 'User registered successfully.' })
    } catch (error) {
        console.error('Registration error: ', error.message)
        res.status(500).json({ error: 'Registration failed. Please try again.' })
    }
}