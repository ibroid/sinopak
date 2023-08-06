// const websocket = new Map();
export const websocket = new Map();

export function getShock() {
    return websocket.get('web') ?? null;
}
