/* Timeline Error class */

function TL_Error(message_key, detail) {
  this.name = 'TL.Error';
  this.message = message_key || 'error';
  this.message_key = this.message;
  this.detail = detail || '';
}

TL_Error.prototype = Object.create(Error.prototype);
TL_Error.prototype.constructor = TL_Error;

TL.Error = TL_Error;
