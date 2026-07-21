/* Adapted from okfn/csv.js under MIT license
https://github.com/okfn/csv.js/blob/master/LICENSE.txt
Copyright (c) 2011-2013 Open Knowledge Foundation

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function chomp(s, lineterminator) {

    if (s == null) return ''

    lineterminator = lineterminator || '\n'

    if (s.charAt(s.length - lineterminator.length) !== lineterminator) {
        // Does not end with \n, just return string
        return s;
    } else {
        // Remove the \n
        return s.substring(0, s.length - lineterminator.length);
    }
}

/**
 * Fetch data from a URL and parse the response as a CSV file.
 * To specify the data source, use `dataset.url`. 
 * @param {Object} dataset 
 * @returns {Promise} which invokes resolve with an array of objects of length 
 * [csv row count - 1], where the 
 * property names are determined by the first row.
 */
export async function fetchCSV(dataset) {
    return new Promise((resolve, reject) => {
        if (dataset.data) {
            var out = extractFields(parse(dataset.data, dataset), dataset);
            out.useMemoryStore = true;
            resolve(out);
        } else if (dataset.url) {
            window.fetch(dataset.url, { mode: 'cors' })
                .then(function(response) {
                    if (response.status != 200) {
                        if (response.headers.get('content-type') == "application/json") {
                            response.text().then(text => {
                                reject(JSON.parse(text))
                            })
                        } else {
                            reject({
                                status_code: response.status,
                                message: `Error fetching CSV: [${response.status} ${response.statusText}]`
                            })
                        }
                        return;
                    }
                    if (response.text) {
                        return response.text();
                    } else {
                        return response;
                    }
                })
                .then(function(data) {
                    if (data) {
                        var out = parseObjects(data, dataset);
                        out.useMemoryStore = true;
                        resolve(out);
                    }
                })
                .catch(msg => {
                    reject({
                        status_code: 500,
                        message: `Error fetching CSV: ${msg}`
                    })
                    return;
                });
        }
    })
};

/**
 * Given an array of rows, split them into an object with two keys:
 * `fields` and `records`. `fields` is the first item of the array
 * and `records` is the remainder. If `noFields.noHeaderRow` is true, 
 * the returned object will not have a `fields` property and its `records`
 * property will be the entire array of input `rows`.
 * @param {Array} rows 
 * @param {Object} [noFields]
 */
export function extractFields(rows, noFields) {
    noFields = noFields || {}
    if (noFields.noHeaderRow !== true && rows.length > 0) {
        return {
            fields: rows[0].map((x, i) => {
                if (x && x.trim) {
                    return x.trim()
                }
                return `untitled${i}`
            }),
            records: rows.slice(1)
        };
    } else {
        return {
            records: rows
        };
    }
};

function normalizeDialectOptions(options) {
    // note lower case compared to CSV DDF
    var out = {
        delimiter: ",",
        doublequote: true,
        lineterminator: "\n",
        quotechar: '"',
        skipinitialspace: true,
        skipinitialrows: 0
    };
    for (var key in options) {
        if (key === "trim") {
            out["skipinitialspace"] = options.trim;
        } else {
            out[key.toLowerCase()] = options[key];
        }
    }
    return out;
};

// ## parse
//
// For docs see the README
//
// Heavily based on uselesscode's JS CSV parser (MIT Licensed):
// http://www.uselesscode.org/javascript/csv/
export function parse(s, dialect) {
    // When line terminator is not provided then we try to guess it
    // and normalize it across the file.
    if (!dialect || (dialect && !dialect.lineterminator)) {
        s = normalizeLineTerminator(s, dialect);
    }

    // Get rid of any trailing \n
    var options = normalizeDialectOptions(dialect);
    s = chomp(s, options.lineterminator);

    var cur = "", // The character we are currently processing.
        inQuote = false,
        fieldQuoted = false,
        field = "", // Buffer for building up the current field
        row = [],
        out = [],
        i,
        processField;

    processField = function(field) {
        if (fieldQuoted !== true) {
            // If field is empty set to null
            if (field === "") {
                field = null;
                // If the field was not quoted and we are trimming fields, trim it
            } else if (options.skipinitialspace === true) {
                field = field.trim();
            }

            // Convert unquoted numbers to their appropriate types
            // but Timeline never expects real numbers, so we'll leave that out here.
            // if (rxIsInt.test(field)) {
            //     field = parseInt(field, 10);
            // } else if (rxIsFloat.test(field)) {
            //     field = parseFloat(field, 10);
            // }
        }
        return field;
    };

    for (i = 0; i < s.length; i += 1) {
        cur = s.charAt(i);

        // If we are at a EOF or EOR
        if (
            inQuote === false &&
            (cur === options.delimiter || cur === options.lineterminator)
        ) {
            field = processField(field);
            // Add the current field to the current row
            row.push(field);
            // If this is EOR append row to output and flush row
            if (cur === options.lineterminator) {
                out.push(row);
                row = [];
            }
            // Flush the field buffer
            field = "";
            fieldQuoted = false;
        } else {
            // If it's not a quotechar, add it to the field buffer
            if (cur !== options.quotechar) {
                field += cur;
            } else {
                if (!inQuote) {
                    // We are not in a quote, start a quote
                    inQuote = true;
                    fieldQuoted = true;
                } else {
                    // Next char is quotechar, this is an escaped quotechar
                    if (s.charAt(i + 1) === options.quotechar) {
                        field += options.quotechar;
                        // Skip the next char
                        i += 1;
                    } else {
                        // It's not escaping, so end quote
                        inQuote = false;
                    }
                }
            }
        }
    }

    // Add the last field
    field = processField(field);
    row.push(field);
    out.push(row);

    // Expose the ability to discard initial rows
    if (options.skipinitialrows) out = out.slice(options.skipinitialrows);

    return out;
}

/**
 * If no lineterminator is specified in `dialect`, convert CRLF and CR 
 * to LF (newline) to simplify splitting lines.
 * @param {String} csvString - a String representation of a CSV file
 * @param {Object} [dialect] - details about the CSV dialect to guide the parser
 */
function normalizeLineTerminator(csvString, dialect) {
    if (dialect && !dialect.lineterminator) {
        return csvString.replace(/(\r\n|\n|\r)/gm, "\n");
    }
    // if not return the string untouched.
    return csvString;
}

/**
 * Given a CSV String, parse it and return it as an array of objects, one-per-row 
 * after the header row. The header is the source of object properties. Will fail 
 * unceremoniously if dialect.noHeaderRow is true
 * @param {String} s - a String representation of a CSV file
 * @param {Object} [dialect] - details about the CSV dialect to guide the parser
 */
export function parseObjects(s, dialect) {
    let rows = extractFields(parse(s, dialect))
    let objects = []
    rows.records.forEach(record => {
        let obj = {}
        rows.fields.forEach((f, i) => obj[f] = record[i])
        objects.push(obj)
    })
    return objects
}