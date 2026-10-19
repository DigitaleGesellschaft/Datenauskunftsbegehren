/**
 * String.prototype.replaceAll() polyfill
 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function(str, newStr){

    // If a regex pattern
    if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
      return this.replace(str, newStr);
    }

    // If a string
    return this.replace(new RegExp(str, 'g'), newStr);

  };
}

export function nl2br(string = '') {
  return string.replaceAll('\n', '<br>')
}

export function br2nl(string = '') {
  return string.replaceAll('<br>', '\n')
}

export function escapeHtml(string = '') {
  return string
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

// Reduces HTML (e.g. from a contenteditable or the URL fragment) to text and line breaks.
// DOMParser creates an inert document: no scripts run and no resources are loaded.
export function sanitizeHtml(html = '') {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  let result = ''
  /** @param {Node} node */
  const walk = node => {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        result += escapeHtml(child.textContent ?? '')
      } else if (child.nodeName === 'BR') {
        result += '<br>'
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // contenteditable wraps new lines in block elements
        if (['DIV', 'P'].includes(child.nodeName) && result.length > 0) {
          result += '<br>'
        }
        walk(child)
      }
    }
  }
  walk(doc.body)
  return result
}

export function removeLeadingTrailingNewlines(string) {
  return string.replace(/^\n|\n$/g, '')
}

export function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

export function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export async function getHash({text, length}) {
  const msgUint8 = new TextEncoder().encode(text);                              // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);             // hash the text
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  if (length) {
    return hashHex.slice(0, length)
  }
  return hashHex;
}