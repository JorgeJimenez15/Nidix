import { Plugin } from '../Plugin.js'
import { insertBan } from '../Database.js'

import { type ServerWebSocket } from 'bun'
import { type DataWebSocket } from '../types.js'

export default class AntiProxy extends Plugin {
    constructor(ws: ServerWebSocket<DataWebSocket>, socket: WebSocket) {
        super(ws, socket)
    }

    playerConnect() {
        fetch(`https://proxycheck.io/v2/${this.ws.remoteAddress}?vpn=1`)
            .then(response => response.json<any>())
            .then(data => {
                if (data.status === 'denied' || data.status === 'error') return

                if (data[this.ws.remoteAddress].proxy === 'yes') {
                    insertBan(this.ws.remoteAddress)
                    return this.ws.close(1000)
                }
            })
    }
}