import { type ServerWebSocket } from 'bun'
import { type DataWebSocket } from './types.js'

export class Plugin {
    declare ws: ServerWebSocket<DataWebSocket>
    declare socket: WebSocket

    constructor(ws: ServerWebSocket<DataWebSocket>, socket: WebSocket) {
        this.ws = ws
        this.socket = socket
    }

    playerConnect() {}
    playerMessage(packet: Buffer) {} // Player -> Reverse-proxy
    playerSend() {} // Reverse-proxy -> Server
    playerDisconnect() {}

    serverConnect() {}
    serverMessage(packet: Buffer) {} // Server -> Reverse-proxy
    serverSend() {} // Reverse-proxy -> Player
    serverDisconnect() {}
}