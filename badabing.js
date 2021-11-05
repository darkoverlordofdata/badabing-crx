
function reload() {
  console.log("force refresh starting ...")
  var httpRequest = new XMLHttpRequest()

  httpRequest.onreadystatechange = function() {

    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        let data = this.response
        let url = data.images[0].url
        let message = data.images[0].copyright
        let title = data.images[0].title
        if (url) {
          chrome.wallpaper.setWallpaper({
            url     : 'https://www.bing.com'+url, 
            layout  : 'STRETCH', 
            filename: 'bing_wallpaper'
          }, () => {
            chrome.notifications.clear("badabing", () => {})
            chrome.notifications.create("badabing", {
                type: 'basic', 
                iconUrl: 'icons/128.png', 
                title: title, 
                message: message, 
                contextMessage: "Bada Bing ..."
              },
              () => {})
            let launchURL = 'https://www.bing.com'+url
            chrome.notifications.onClicked.addListener(() => window.open(launchURL))
                
          })
        }
      } else {
        console.log("Something went wrong. Are you connected to internet?")
      }
    }
  }
  
  httpRequest.open('GET', 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1')
  httpRequest.responseType = 'json'
  httpRequest.send()
}

document.getElementById("reload").addEventListener("click", reload)
