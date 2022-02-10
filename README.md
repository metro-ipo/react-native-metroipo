# @metroipo/react-native-metroipo

Official [React-Native](https://github.com/facebook/react-native) wrapper for the Metro Ipo SDK.

## Installation

```sh
npm install @metroipo/react-native-metroipo
# OR
yarn add @metroipo/react-native-metroipo
```

## Linking
Linking is automatic, however, you still need to perform a few steps for iOS.

### iOS
- Ensure that `use_frameworks!` is added to your app target in your Podfile.
- Run `npx pod-install` to retrieve the sdk.

### Android
No additional setup is necessary.

## Usage

```js
import { MetroIpo, MetroIpoConfig } from 'react-native-metroipo';
```

## Starting the Signature Capture Flow 
```js
try {
    const config = MetroIpoConfig.setDomain("METRO_URL").setCode("CODE").build();
    const init = await MetroIpo.init(config);
    if (init.success) {
        // Successfully initialized the SDK.
    }

    // Starting the Signature Capture
    const res = await MetroIpo.startCapture();
    if (res.success) {
        // Successfully started the SDK.
    }
} catch (error) {
    // Could not start the SDK.
}
```

## Adding Customizations
```js
// Customizing the Theme - iOS only. The Android theme can be updated in your app's colors.xml file. See here for further details: https://github.com/metro-ipo/metroipo-android-sdk#6-customizing-the-theme
const config = MetroIpoConfig.setDomain("METRO_URL").setCode("CODE")
.setAppearance({
  colorPrimary: '#000000' <Hex String>,
  colorButtonPrimary: '#000000' <Hex String>,
  colorButtonPrimaryText: '#FFFFFF' <Hex String>,
  colorButtonPrimaryPressed: '#000000' <Hex String>
})
.build();

const init = await OrbaOne.init('publishable-api-key', 'applicant-id', verificationConfig);
```
## Handling Capture Callbacks

```js
React.useEffect(() => {
MetroIpo.onComplete((event: any) => {
    setResult(event.message);
});

MetroIpo.onCancel((event: any) => {
    setResult(event.message);
});

return () => {
    MetroIpo.removeListeners();
}
});
```

## Troubleshooting
When installing or using `@metroipo/react-native-metroipo` you may encounter the following problems:

[iOS] - If you are using `@react-native-firebase` in your project, along with `use_frameworks!`, you may encounter an error with `RNFirebase`. To avoid this, add `$RNFirebaseAsStaticFramework = true` at the top of your `Podfile`. 

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
