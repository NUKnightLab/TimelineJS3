/* Timeline Error class */
export default class TLError extends Error {
    constructor(message_key, detail) {
        super()
        this.name = 'TLError';
        this.message = message_key || 'error';
        this.message_key = this.message;
        this.detail = detail || '';
    }
}
