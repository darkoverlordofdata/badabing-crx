
export function setWallpaper(url, hash, title, message) 
{

  if (url) {
    let imageUrl = 'https://www.bing.com'+url
    chrome.wallpaper.setWallpaper(
      {
        url     : imageUrl, 
        layout  : 'STRETCH', 
        filename: 'bing_wallpaper'
      }, 
      () => 
      {
        chrome.notifications.clear("badabing", () => {})
        chrome.notifications.create("badabing", 
          {
            type          : 'basic', 
            iconUrl       : 'icons/128.png', 
            title         : title, 
            message       : message, 
            contextMessage: "Bada Bing ..."
          },
          () => {}
        )
        chrome.notifications.onClicked.addListener(async () => await chrome.tabs.create({ url: imageUrl }))
      })
  } 
  else {
    console.log("badabing: refresh failed")
  }
}
