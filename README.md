# napstop

A project worked on for Makers Academy Makerthon. Our task was to create a mobile app that could be initialised with a destination and would alert a user once they reached a certain proximity of that destination.

# Key Learning Areas

* PhoneGap/Cordova
* Geolocations
* Angular JS
* Google Maps Autocomplete

# The Team

* Phil Brockwell (Thats me)
* Louise Beh: [Profile](https://github.com/louisebeh)
* Costas Sarris: [Profile](https://github.com/costassarris)
* Joe Newman: [Profile](https://github.com/jjnewman)

Between us we delivered a product that contained all the key functionality. We built the app using HTML/CSS and Jquery/Angular.
We then used the Phonegap/Cordova service to serve the app to mobile devices. We were also able to deploy the app via xCode, however it has not been fully deployed to the mobile app store, yet.

* The app used the google maps auto complete service to get co-ordinates for a destination.
* Geo-locations was used to get the users current location.
* These two sets of co-ordinates were then compared with a built in method, which calculates the straight line distance between any two sets of map co-ordinates.
* This method was called at a set interval, and the distance was compared with a proximity variable to check if a user is within range of the destination.
* Once this method was true Angular JS was able to change the view and phonegap method alerted the phone.

# Screenshots

![ScreenShot](https://github.com/robertpulson/napstop/blob/master/screenshots/IMG_3799.PNG?raw=true)
![ScreenShot](https://github.com/robertpulson/napstop/blob/master/screenshots/IMG_3800.PNG?raw=true)
![ScreenShot](https://github.com/robertpulson/napstop/blob/master/screenshots/IMG_3801.PNG?raw=true)
![ScreenShot](https://github.com/robertpulson/napstop/blob/master/screenshots/IMG_3802.PNG?raw=true)
![ScreenShot](https://github.com/robertpulson/napstop/blob/master/screenshots/IMG_3803.PNG?raw=true)

# Videos

We created two videos to promote our app, they can be viewed at the following URLs:

[Technical Explanation](https://www.youtube.com/watch?v=rC8bOD7lQbo)

[Advert](https://www.youtube.com/watch?v=MuQi8JT5IaY)

# Future Enhancements

* Deploy to Apple App Store
* Deploy to Google Play Store
* Work on styling of previous destinations
* Fully test all code and functionality

# Getting Started

To clone the repo paste the following into your terminal:

`git clone https://github.com/robertpulson/napstop.git`

Navigate into it:

`cd napstop`

Use homebrew to install node (if not installed):

`brew install node`

Then install Phonegap:

`$ sudo npm install -g phonegap`

Run `phonegap serve` to run the program over the wireless network.

You can now view the app in your browser by pasting in the port address, or you can download the phonegap app on your mobile and enter the port address to view the app on your phone.

If you have xCode installed you can deploy the app to your phone by using:

`cordova build ios`

And then opening the `.xcodeproj` file inside `platforms -> ios`. If you connect a suitable device you can download the app to it, with full functionality, however an Apple Developers License is required for this.
