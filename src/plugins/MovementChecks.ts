export default class MovementChecks {
    getDistance(x1: number, y1: number, x2: number, y2: number): number {
        const x = x2 - x1
        const y = y2 - y1

        return Math.sqrt(x * x + y * y)
    }

    validate(x1: number, y1: number, x2: number, y2: number): boolean {
        // Players movement coordinates should be within the view base
        // Default values are 1920x1080. 1920 / 2 = 960, 1080 / 2 = 540. We'll use 960 because it's the max value
        if (this.getDistance(x1, y1, x2, y2) > 960) {
            // Allows cheaters to teleport if the server is using a vulnerable MultiOgar-Edited version
            if (x2 === Infinity || x2 === -Infinity || y2 === Infinity || y2 === -Infinity) return false // User should be temporary banned for cheating

            return false // User should be flagged and kicked if repeated multiple times
        }

        // TODO: Check movement coordinates with others to know if they are going to the same place

        return true
    }
}