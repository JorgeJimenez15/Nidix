import { Plugin } from '../Plugin.js'
import { type ServerWebSocket } from 'bun'
import { type DataWebSocket } from '../types.js'

export default class MovementChecks extends Plugin {
    declare playerX: number
    declare playerY: number

    constructor(ws: ServerWebSocket<DataWebSocket>, socket: WebSocket) {
        super(ws, socket)

        this.playerX = 0
        this.playerY = 0
    }

    getDistance(x1: number, y1: number, x2: number, y2: number): number {
        const x = x2 - x1
        const y = y2 - y1

        return Math.sqrt(x * x + y * y)
    }

    playerMessage(packet: Buffer) {
        if (packet.readUint8() !== 0x10) return

        let movementX: number, movementY: number

        // Protocol version 5 late and 6+
        if (packet.length === 13) {
            movementX = packet.readUInt32LE(1)
            movementY = packet.readUInt32LE(5)
        }
        // Protocol version 4
        else if (packet.length === 9) {
            movementX = packet.readDoubleLE(1)
            movementY = packet.readDoubleLE(9)
        }
        // Protocol version 5 early
        else {
            movementX = packet.readUInt16LE(1)
            movementY = packet.readUInt16LE(3)
        }

        // Players movement coordinates should be within the view base
        // Default values are 1920x1080. 1920 / 2 = 960, 1080 / 2 = 540. We'll use 960 because it's the max value
        if (this.getDistance(this.playerX, this.playerY, movementX, movementY) > 960) {
            // Allows cheaters to teleport if the server is using a vulnerable MultiOgar-Edited version
            if (movementX === Infinity || movementX === -Infinity || movementY === Infinity || movementY === -Infinity) {
                // User should be temporary banned for cheating
            }

            // User should be flagged and kicked if repeated multiple times
        }
    }

    serverMessage(packet: Buffer) {
        // TODO: Get player coordinates
    }
}