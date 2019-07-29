import { finnMiljoStreng } from '../utils/index';

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
        // eslint-disable-next-line no-console
        console.error(error.message || 'Noe gikk galt under oppkobling av WS til ModiaContextHolddr', error);
    };
    connection.onclose = () => {
        setTimeout(() => {
            opprettWebsocketConnection(ident, callback);
        }, 1000);
    };
};
