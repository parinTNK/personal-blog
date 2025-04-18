import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const { Pool } = pkg

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const connectToDatabase = async () => {
    try {
        await pool.connect()
        console.log('Connected to the database')
    } catch (error) {
        console.error('Error connecting to the database', error)
    }
}

export default connectToDatabase