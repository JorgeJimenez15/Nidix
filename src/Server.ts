import { serve } from 'bun'
import Player from './Player.js'
import { getBan } from './Database.js'

import { type DataWebSocket } from './types.js'

export default class Server {
    constructor() {
        serve<DataWebSocket>({
            fetch(req, server) {
                // TODO: Read upgrade documentation for multiple routes
                if (server.upgrade(req, {
                    data: {
                        player: new Player()
                    }
                })) return

                return new Response('Failed to upgrade', {
                    status: 500
                })
            },
            websocket: {
                open(ws) {
                    if (getBan(ws.remoteAddress)) ws.close(1000, 'Access denied')

                    ws.data.player.initialize(ws, 'ws://192.168.0.2:8080')
                },
                message(ws, message) {
                    ws.data.player.message(message)
                },
                close(ws) {
                    ws.data.player.socket.close(1000)
                }
            }
        })
    }
}