'use strict';

/**
 * This function won't cause error by define non-ws protocol.
 * Instead, it overrides value with ws protocol.
 *
 * @param url: string
 * @return string
 */
function setWsProtocol (url) {
  var h = url.split("://");
  var protocol = (h[1])? h[0]: "ws";
  var hostname = (h[1])? h[1]: h[0];
  if (protocol.indexOf("ws") < 0) {
    protocol = (protocol === "https")? "wss": "ws";
  }

  return protocol + '://' + hostname;
}

module.exports = {
  setWsProtocol: setWsProtocol,
}