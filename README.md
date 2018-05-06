# Save the Eggs
Software Design and Development (COMP 225) class project; Created a JavaScript game with PHASER framework.

INTRODUCTION
------------

Save the Eggs is a mobile game developed with HTML5, CSS, JavaScript, and the Phaser game engine. The objective of the
game is to save as many eggs as possible by catching them in the bucket. Touch and drag the bucket from side to side
across the screen and catch the falling eggs. Catching a bomb will subtract a life. The user has three lives to spare
before the game ends. Failure to catch an egg will subtract points from the score. The game will end if the user's
score reaches zero this way.


COMPATIBILITY
-------------

Save the Eggs is currently compatible with mobile devices. The game is currently deployed as an Android app (apk)
and works on browsers on iPhones 6, 7, and 8. (Note that this game is not compatible with a desktop or tablet.)


INSTALLATION, BUILDING, and DEPLOYMENT
-------

To install the game on an Android device, we need:
1. To include the phaser.min.js file in the folder. To obtain this, go to https://phaser.io/download/release/2.10.4
   From there, download the latest version of Phaser.

2. Zip the SaveEggsGame folder

3. We can use Cocoon.io for wrapping up our folder.
    1) Go to: https://cocoon.io and register for an account
    2) Upload your zip file (with WinRAR) and go to the settings stage
    3) In your Android's settings, switch Webview engine > Webview, Orientation > Portrait Fullscreen > No
    4) We need to add an Android key in the signing section. Please see:
    https://www.joshmorony.com/how-to-build-html5-mobile-games-with-cocoonjs/ for reference
    5) Save all changes and compile the project
    6) Download the zipped and compiled file. Use WinRAR to unzip the apk file
    7) Go to the command line and find the unzipped folder's directory
    8) Connect your Android device with the computer
    9) Enable Developer Mode on your phone
    10) adb install theCompiledGame.apk (tab)

4. For device browser testing, please do the following:
    1) Download Webstorm IDE, open this project, and run it;
    2) Download Node.js server
       (1) Go to the SavetheEggs Directory
       (2) http-server
       (3) Open up your browser and enter the localhost url indicated in the Node.js

CITATIONS
--------
1) https://stackoverflow.com/

2) https://phaser.io/tutorials/making-your-first-phaser-game

3) https://github.com/kimchristiansen/poisson-disk-sampler-js/

4) https://freesound.org/
