import { Plugin } from '../Plugin.js'
import { insertBan } from '../Database.js'

import { type ServerWebSocket } from 'bun'
import { type DataWebSocket } from '../types.js'

export default class SpawnChecks extends Plugin {
    declare pastTime: number
    declare currentTime: number
    declare difference: number
    declare flags: number

    constructor(ws: ServerWebSocket<DataWebSocket>, socket: WebSocket) {
        super(ws, socket)

        this.pastTime = 0
        this.currentTime = 0
        this.difference = 0
        this.flags = 0
    }

    playerMessage(packet: Buffer) {
        if (packet.readUint8() !== 0x00) return

        this.pastTime = this.currentTime
        this.currentTime = Math.floor(Date.now() / 1000)
        const newDifference = this.currentTime - this.pastTime

        if (newDifference - this.difference <= 1) {
            if (this.flags > 4) {
                insertBan(this.ws.remoteAddress)
                return this.ws.close(1000)
            }

            this.flags++
        }

        this.difference = newDifference
    }
}