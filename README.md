# SavetheEggs
Software Design and Development (COMP 225) class project; Create a JavaScript game with PHASER framework.

INTRODUCTION
------------

SavetheEggs is a mobile game developed by HTML5, CSS, JavaScript, and Phaser game engine. The objective of the game is to
save as many eggs in the basket. Touch and drag the basket from side to side across the screen and
catch the falling eggs. Catching a bomb will lose a life. The user has three lives to spare before the game ends.
Failure to catch a normal and special eggs will cause score loss. The game will end when the user's score
is below zero.


COMPATIBILITY
-------------

SavetheEggs is currently compatible with mobile devices. The game is currently deployed
as Android app (apk) and browsers on iOS iPhone. (Note that this game is not compatible with Desktop or tablet.


INSTALLATION, BUILDING, and DEPLOYMENT
-------

To install the game on a Android device, we need:
1. include phaser.min.js file in the folder.
   Go to: https://phaser.io/download/release/2.10.4 and download the latest version of phaser

2. Zip the SaveEggsGame folder

3. We can use CocoonJS for wrapping up our folder.
    1) Go to: https://cocoon.io and register an account;
    2) Upload your zip file (with WinRAR) and go to setting stage;
    3) In the Android setting, switch Webview engine --> Webview, Orientation --> Portrait
        Fullscreen --> No;
    4) We need to add an Android key in the signing section. Please see:
    https://www.joshmorony.com/how-to-build-html5-mobile-games-with-cocoonjs/ for reference
    5) Save all changes and compile the project;
    6) Then download the zipped and compiled file use WinRAR to unzip the apk file;
    7) Go to command line and find the unzipped folder's directory
    8) Connect your Android device with the computer
    9) Enable the developer mode on your phone
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
