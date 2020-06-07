# Stillies

<p align="center">
<img src="https://user-images.githubusercontent.com/5257356/83978416-981b1b80-a907-11ea-96c6-622283f5dbf4.png" alt="logo"/>
</p>

Play movies on your laptop/Raspberry Pi using your phone as a remote.

I created this project because I am lazy and I wanted quick access to my movie library on movie nights, while attaching my laptop to the big screen.

You point Stillies to a directory on your machine and it will traverse it and fetch movie information to every movie in that directory, which you will see as a list on your phone when you open the companion [web client](https://github.com/shockry/stillies). From there you can:

* See movie poster and details
* Play trailer
* Play movie
* pause

It's a too specific use case and  very tailored to my personal needs but can be extended.

I would show screenshots but I'm not really sure about copyrights 🙃

# FAQ

1. Bluetooth sounds like the best solution for this. Why websockets?

Correct. Websockets can be spotty, slow and require constant onnection to the internet. But it was the most suitable solution for my use because mobile Safari doesn't support web bluetooth yet and I don't want to write an iOS app because I don't have a license and I don't want to reinstall it every 6 days. I plan to use Bluetooth whenever it's possible.

2. What's with the name?

It's a ridiculous pun on the work "movies"

# Roadmap if I keep coming back

* CI/CD
* Subtitles
* Adjustable volume
* Seeking
* More movie details
* Faster movie playback (converting to blob takes time)
* Better fullscreen solution
* Button to force update library
* Ignore movies that fail to fetch their info
* Remove duplicate movies
* Notify if chosen directory doesn't contain any movies
* Maybe Better guessing for movie names (file names currently have to be exactly match movie names)
