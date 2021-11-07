import { setWallpaper } from "./setWallpaper.js"

function Run()
{
  console.log("Alarm")


  fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1')
  .then(response => response.text())
  .then(obj => 
    {
      let data = JSON.parse(obj)
      if (data.images[0].url) {
        let url = data.images[0].url
        let hash = data.images[0].hsh
        let message = data.images[0].copyright
        let title = data.images[0].title

        chrome.storage.local.get({lastHash: 'None'}, (items) => {
          if (hash != items.lastHash) 
            setWallpaper(url, hash, title, message)
          else 
            console.log(`badabing: url not found: ${url}`)
        })

      }

    })
  .catch(error => console.log("error", error))
}


chrome.alarms.onAlarm.addListener(Run)

// calculate daily at 1am
chrome.runtime.onStartup.addListener( () => 
{
  chrome.alarms.create("update", {"delayInMinutes": 2,"periodInMinutes": 60})
})

chrome.runtime.onInstalled.addListener(async (details) => 
{
  if (details.reason == "install") {
    Run()
    chrome.alarms.create("update", {"delayInMinutes": 60,"periodInMinutes": 60})
  }
})
