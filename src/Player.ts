import { Buffer } from 'buffer'

import { type ServerWebSocket } from 'bun'
import { type DataWebSocket } from './types.js'

export default class Player {
    declare ws: ServerWebSocket<DataWebSocket>
    declare socket: WebSocket

    initialize(ws: ServerWebSocket<DataWebSocket>, url: string) {
        this.ws = ws

        this.connect(url)
    }

    connect(url: string) {
        this.socket = new WebSocket(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Nidix/1.0; +http://nidix.io/proxy.html)',
                'Cache-Control': 'no-cache',
                'X-Forwarded-For': this.ws.remoteAddress
            }
        })
        this.socket.binaryType = 'arraybuffer'
        this.socket.onopen = () => {
            const resetConnection = Buffer.alloc(5)

            resetConnection.writeUInt8(0xFE, 0)
            resetConnection.writeUInt32LE(0x06, 1)
            this.send(resetConnection)

            resetConnection.writeUInt8(0xFF, 0)
            resetConnection.writeUInt32LE(0x01, 1)
            this.send(resetConnection)
        }
        this.socket.onmessage = event => {
            const packet = Buffer.from(event.data)
            this.ws.send(packet)
        }
        this.socket.onclose = event => {
            console.log(`[Player] Disconnected. Code: ${event.code}, reason: ${event.reason}`)
        }
    }

    message(message: string | Uint8Array) {
        const packet = Buffer.from(message)

        // ...
        this.send(packet)
    }

    send(buffer: Buffer) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) this.socket.send(buffer)
    }
}