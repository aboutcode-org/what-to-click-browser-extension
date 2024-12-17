browser.runtime.onMessage.addListener(async ({ type = 'general', data = {} }, sender) => {
  if (type === 'mousedown') {
    const currentSession = await localforage.getItem('currentSession');
    if (currentSession == null) {
      return;
    }
    const sessionKey = `images-${currentSession}`;
    const image = await captureTabWithCursor(data.x, data.y, data.size)
    await localforage.setItem(
      sessionKey,
      [...await localforage.getItem(sessionKey) || [], {
        image,
        type: type,
        target: data.target,
        url: data.url,
      }]
    );
  } else if (type === 'popstate') {
    const currentSession = await localforage.getItem('currentSession');
    if (currentSession == null) {
      return;
    }
    const sessionKey = `images-${currentSession}`;
    await localforage.setItem(
      sessionKey,
      [...await localforage.getItem(sessionKey) || [], {
        type: type,
        url: data.url,
      }]
    );
  } else if (type === 'fetchImages') {
    return await localforage.getItem(`images-${data.session}`) || [];
  } else if (type === 'fetchSessions') {
    return await localforage.getItem('sessions') || [];
  } else if (type === 'savePdf') {
    return await browser.tabs.saveAsPDF({
      toFileName: `what-to-click-${new Date().toDateString()}.pdf`,
      footerLeft: '',
      footerRight: '',
      headerLeft: '',
      headerRight: '',
    });
  }
});

browser.browserAction.onClicked.addListener(async () => {
  const sessionActive = await localforage.getItem('currentSession');
  if (sessionActive) {
    await localforage.setItem('currentSession', null);
    await browser.browserAction.setIcon({ path: '/icons/record.svg' });
    await browser.browserAction.setBadgeText({ text: '' });
    if ((await localforage.getItem(`images-${sessionActive}`)).length > 0) {
      await browser.tabs.create({ url: `/content/page.html?s=${encodeURIComponent(sessionActive)}`, active: false });
    }
  } else {
    const session = new Date().toISOString();
    await localforage.setItem('currentSession', session);
    await localforage.setItem('sessions', [...(await localforage.getItem('sessions') || []), session]);
    await browser.browserAction.setIcon({ path: '/icons/stop.svg' });
    await browser.browserAction.setBadgeText({ text: 'live' });
  }
});


browser.webNavigation.onCommitted.addListener(async (event) => {
  const currentSession = await localforage.getItem('currentSession');
  if (currentSession == null) {
    return;
  }

  if (event.transitionQualifiers.includes('forward_back')) {
    const sessionKey = `images-${currentSession}`;
    await localforage.setItem(
      sessionKey,
      [...await localforage.getItem(sessionKey) || [], {
        type: 'backNavigation',
        url: event.url,
      }]
    );
  }
});


async function captureTabWithCursor(mouseX, mouseY, windowSize) {
  try {

    const imageDataUrl = await browser.tabs.captureVisibleTab(
      {
        format: 'jpeg',
        quality: 95,
      }
    );

    const img = await loadImage(imageDataUrl);

    const imagePngUrl = browser.runtime.getURL('../content/assets/cursor.png');
    const cursorImg = await loadImage(imagePngUrl);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match the captured image dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the captured image onto the canvas
    ctx.drawImage(img, 0, 0);

    const cursorX= (img.width/windowSize.width) *mouseX
    const cursorY= (img.height/windowSize.height) *mouseY

    // Position the cursor at mouseX, mouseY
    const cursorSizePercentage = 5;
    const cursorWidth = img.width * cursorSizePercentage / 100;
    const cursorHeight = img.height * cursorSizePercentage / 100;

    ctx.drawImage(cursorImg, cursorX - cursorWidth / 2.1, cursorY - cursorHeight / 0.9, cursorWidth, cursorWidth);

    // Convert canvas to a base64 image URL
    const resultImageUrl = canvas.toDataURL('image/png');
    return resultImageUrl;
  } catch (error) {
    console.error("Error capturing tab or drawing cursor:", error);
    throw error;
  }
}

// Load image and return a Promise
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Error loading image: ' + err));
    img.src = src;
  });
}
