## Build Instructions

1. Make sure you've installed [Android Studio](https://developer.android.com/studio/index.html). This project requires [JDK 11](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html).
1. Make sure you've installed [Xcode](https://developer.apple.com/support/xcode/).
1. Install npm using [Node Version Manager](https://github.com/nvm-sh/nvm)(nvm).
1. Install yarn using `npm install -g yarn`.
1. Go to Android Studio → Tools → AVD Manager and create an emulated device.
1. In this example app:

- `cd ios` to enter the iOS directory.
- `pod install` to install iOS dependencies via CocoaPods.

## Build for Debugging

1. Run `yarn`
1. Run `yarn android` or `yarn ios`.
