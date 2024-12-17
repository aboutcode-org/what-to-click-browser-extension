async function sendMessageToBg({ type = 'general', data = {} } = {}) {
  try {
    const response = await browser.runtime.sendMessage({ type, data });
    return response;
  } catch (error) {
    console.error("sendMessageToBackground error: ", error);
    return null;
  }
}

document.addEventListener('mousedown', ({ clientX, clientY, target }) => {
  sendMessageToBg(createMouseDownRecord(clientX, clientY, target));
});

function createMouseDownRecord(clientX, clientY, target) {
  const windowSize = {height: window.innerHeight, width: window.innerWidth};
  return {
    type: 'mousedown',
    data: {
      x: clientX,
      y: clientY,
      size: windowSize,
      target: {
        innerText: target.innerText,
        tagName: target.tagName,
      },
      url: location.href,
    }
  };
}

function addIframeMouseDownListener(iframe) {
  try {
    function attachListener() {
      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.addEventListener('mousedown', ({ clientX, clientY, target }) => {
        const iframePos = iframe.getBoundingClientRect();
        const clickPosition = { x: clientX + iframePos.left, y: clientY + iframePos.top };
        sendMessageToBg(createMouseDownRecord(clickPosition.x, clickPosition.y, target));
      });
    }
    iframe.addEventListener('load', attachListener);
  } catch (e) { /* Can cause SecurityError, which nothing can be do about */ }
}

[...document.getElementsByTagName('iframe')].forEach(addIframeMouseDownListener);

const observer = new MutationObserver((mutationList) => {
  mutationList.forEach((mutation) => {
    [...mutation.addedNodes].filter((e) => e.nodeName == 'IFRAME').forEach(addIframeMouseDownListener);
  });
});
observer.observe(document, { attributes: false, subtree: true, childList: true })
