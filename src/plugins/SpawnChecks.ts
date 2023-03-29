import { Plugin } from '../Plugin.js'
import { type ServerWebSocket } from 'bun'
import { type DataWebSocket } from '../types.js'

export default class SpawnChecks extends Plugin {
    declare intervals: number[]

    constructor(ws: ServerWebSocket<DataWebSocket>, socket: WebSocket) {
        super(ws, socket)

        this.intervals = []
    }

    playerMessage(packet: Buffer) {
        if (packet.readUint8() !== 0x00) return

        const second = Math.floor(Date.now() / 1000)
        this.intervals.push(second)

        // Compare time differences
    }
}