/* Timeline Error class */

function TLError(message_key, detail) {
    this.name = 'TLError';
    this.message = message_key || 'error';
    this.message_key = this.message;
    this.detail = detail || '';
  
    // Grab stack?
    var e = new Error();
    if(e.hasOwnProperty('stack')) {
        this.stack = e.stack;
    }
}

TLError.prototype = Object.create(Error.prototype);
TLError.prototype.constructor = TLError;

export { TLError }
