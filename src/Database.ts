import { Database } from 'bun:sqlite'

export const db = new Database('nidix.sqlite3', {
    create: true
})

// Create table if it doesn't exist
db.run('CREATE TABLE IF NOT EXISTS bans (id INTEGER PRIMARY KEY AUTOINCREMENT, ip TEXT)')

const getBanQuery = db.query('SELECT * FROM bans WHERE ip = $ip')
const insertBanQuery = db.query('INSERT INTO bans (ip) VALUES ($ip)')

export const getBan = (ip: string) => {
    return getBanQuery.get({
        $ip: ip
    })
}
export const insertBan = (ip: string) => {
    return insertBanQuery.run({
        $ip: ip
    })
}