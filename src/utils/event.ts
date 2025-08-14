export function bindEvent(element: any, eventName: any, eventHandler: any) {
  if (element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent("on" + eventName, eventHandler);
  }
}

export function unbindEvent(element: any, eventName: any, eventHandler: any) {
  if (element.addEventListener) {
    element.removeEventListener(eventName, eventHandler, false);
  }
}

export function messageToChildFrame(iframeEl: any, msg: any) {
  // Make sure you are sending a string, and to stringify JSON
  iframeEl.contentWindow.postMessage(msg, "*");
}

export function sendMessageToParent(msg: any) {
  // Make sure you are sending a string, and to stringify JSON
  // window.parent.postMessage(msg, `${config.domain_name}`);
  // let url = new URL(document.referrer);
  // let target = url.protocol + "//" + url.host;
  window.parent.postMessage(msg, "*");
}
