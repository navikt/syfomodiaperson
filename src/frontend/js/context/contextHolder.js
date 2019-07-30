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
        post('/logs/info', { message: `ContextHolderConnection.onmessage - Mottok endring av ident fra ModiaContextHolder: ${ident}`, data: { ident } }).then(() => {});
    };
    connection.onerror = (error) => {
        const message = `ContextHolderConnection.onerror: ${error.message || 'Noe gikk galt i wss-connection til ModiaContextHolder'}`;
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
