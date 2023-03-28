import { type BinaryLike, createHash, randomBytes } from 'crypto'

export default class PacketObfuscation {
    sha256(data: BinaryLike): string {
        return createHash('sha256').update(data).digest('hex')
    }

    random(): string {
        return randomBytes(8).toString('hex')
    }

    createToken(ip: string, time: number, random: string): string {
        return this.sha256(`${ip}${time}${random}`)
    }

    validateToken(token: string, ip: string, time: number, random: string): boolean {
        // The token should be valid up to 2 hours and must be the same
        if (time + 7200 > Date.now() && token === this.createToken(ip, time, random)) return true // 2 * 60 * 60 = 7200 seconds

        return false
    }
}