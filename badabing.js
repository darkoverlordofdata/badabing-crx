import { setWallpaper } from "./setWallpaper.js"
function reload() 
{
  console.log("badabing: reload")

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
        setWallpaper(url, hash, title, message)
      }
    })
  .catch(error => console.log("error", error))
}



document.getElementById("reload").addEventListener("click", reload)
