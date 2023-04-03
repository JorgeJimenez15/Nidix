import { Buffer } from 'buffer'

import { type ServerWebSocket } from 'bun'
import { type DataWebSocket } from './types.js'

export default class Player {
    declare ws: ServerWebSocket<DataWebSocket>
    declare socket: WebSocket

    declare url: string
    declare version: number

    initialize(ws: ServerWebSocket<DataWebSocket>, url: string) {
        this.ws = ws
        this.url = url
    }

    connect() {
        this.socket = new WebSocket(this.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Nidix/1.0; +https://jorgejimenez.net/github/nidix)',
                'Cache-Control': 'no-cache',
                'X-Forwarded-For': this.ws.remoteAddress
            }
        })
        this.socket.binaryType = 'arraybuffer'
        this.socket.onopen = () => {
            const resetConnection = Buffer.alloc(5)

            resetConnection.writeUInt8(0xFE, 0)
            resetConnection.writeUInt32LE(this.version, 1)
            this.send(resetConnection)

            resetConnection.writeUInt8(0xFF, 0)
            resetConnection.writeUInt32LE(0x01, 1)
            this.send(resetConnection)
        }
        this.socket.onmessage = event => {
            const packet = Buffer.from(event.data)
            
            // ...
            this.ws.sendBinary(packet)
        }
        this.socket.onclose = () => {
            this.ws.close(1000)
        }
    }

    message(message: string | Uint8Array) {
        const packet = Buffer.from(message)

        if (!this.socket && packet.length === 5 && packet.readUInt8() === 0xFE) {
            this.version = packet.readUInt32LE(1)
            
            if (this.version < 4 || this.version > 8) return this.ws.close(1000, 'Unsupported version')

            this.connect()
        }

        // ...
        this.send(packet)
    }

    send(buffer: Buffer) {
        if (this.socket && this.socket.readyState === 1) this.socket.send(buffer)
    }
}