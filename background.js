
function Run() {
  console.log("Got Alarm! Updating wallpaper ...")
  var httpRequest = new XMLHttpRequest()

  httpRequest.onreadystatechange = function() {

    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        let data = this.response
        if (data.images[0].url) {
          let url = data.images[0].url
          let hash = data.images[0].hsh
          let message = data.images[0].copyright
          let title = data.images[0].title

          chrome.storage.local.get({lastHash: 'None'}, (items) => {
            if (hash != items.lastHash) 
              setWall(url, hash, title, message)
            else 
              console.log("New wallpaper not available.")
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

function setWall(url, hash, title, message) {
  chrome.wallpaper.setWallpaper({
    url     : 'https://www.bing.com'+url,
    layout  : 'STRETCH',
    filename: 'bing_wallpaper'
  }, () => {
      chrome.storage.local.set({lastHash: hash})
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

    }
  )
}


chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('badabing.html', {state: 'maximized'})
})


chrome.alarms.onAlarm.addListener(Run)


// calculate daily at 1am
chrome.runtime.onStartup.addListener( function() {
  chrome.alarms.create("update", {"delayInMinutes": 2,"periodInMinutes": 60})
})

chrome.runtime.onInstalled.addListener( function(details) {
  if(details.reason == "install") {
    Run()
    chrome.alarms.create("update", {"delayInMinutes": 60,"periodInMinutes": 60})
  }
})
