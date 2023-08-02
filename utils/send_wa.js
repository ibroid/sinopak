
export async function sendMessage(number, text) {
    return await fetch(process.env.HTTP_WA_API + '/api/sendText', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "chatId": number,
            "text": text,
            "session": "default"
        })
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            return res.json()
        })
}