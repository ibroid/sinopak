const { ref, onUnmounted } = Vue;
// import WebSocket from 'ws';

export function useWebSocket(url) {
    const socket = new WebSocket(url);
    const isConnected = ref(false);

    socket.onopen = () => {
        isConnected.value = true;
    };

    socket.onclose = () => {
        isConnected.value = false;
    };

    // Handle incoming messages (you can customize this part based on your application needs)
    socket.onmessage = (event) => {
        // Do something with the received message
        console.log('Received message:', event.data);
    };

    // Handle errors (you can customize this part based on your application needs)
    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    // Close the WebSocket connection when the component unmounts
    onUnmounted(() => {
        socket.close();
    });

    // Expose the socket and isConnected state to the component using the Composition API
    return { socket, isConnected };
}
