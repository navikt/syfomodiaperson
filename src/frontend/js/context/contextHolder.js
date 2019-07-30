import { finnMiljoStreng } from '../utils/index';
import { post } from '../api';
const ContextholderConnection = (ident) => {
    return new WebSocket(`wss://veilederflatehendelser${finnMiljoStreng()}.adeo.no/modiaeventdistribution/ws/${ident}`);
};

export const opprettWebsocketConnection = (ident, callback) => {
    if (window.location.hostname.indexOf('localhost') !== -1) {
        return;
    }

    const connection = new ContextholderConnection(ident);
    connection.onmessage = (e) => {
        callback(e);
    };
    connection.onerror = (error) => {
        const message = error.message || 'Noe gikk galt under oppkobling av WS til ModiaContextHolder';
        // eslint-disable-next-line no-console
        console.error(message, error);
        // logg fra server (for kibana)
        post('/logs/error', { message, data: error }).then(() => {});
    };
    connection.onclose = () => {
        setTimeout(() => {
            opprettWebsocketConnection(ident, callback);
        }, 1000);
    };
};
