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
import { MetroIpo, MetroIpoConfig } from '@metroipo/react-native-metroipo';
```

## Starting the Signature Capture Flow 
```js
try {
    const config = MetroIpoConfig.setDomain("METRO_URL").build();
    const init = await MetroIpo.init(config);
    if (init.success) {
        // Successfully initialized the SDK.
    }

    // Starting the Signature Capture
    const res = await MetroIpo.startCapture("CODE");
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
const config = MetroIpoConfig.setDomain("METRO_URL")
.setAppearance({
    colorPrimary: '#000000' <Hex String>,
    colorTextPrimary: '#000000' <Hex String>,
    colorButtonPrimary: '#000000' <Hex String>,
    colorButtonPrimaryText: '#FFFFFF' <Hex String>,
    colorButtonPrimaryPressed: '#000000' <Hex String>,
    imageNavCenterLogo: '' <String>, // Name of Asset in Xcode 
    imageNavBackground: '' <String>, //  Name of Asset in Xcode 
    imageBottomLogo: '' <String>, // Name of Asset in Xcode
    buttonBorderRadius: 18 <Number>,
})
.build();

const init = await MetroIpo.init(config);
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
}, []);
```

## Troubleshooting
When installing or using `@metroipo/react-native-metroipo` you may encounter the following problems:

[iOS] - If you are using `@react-native-firebase` in your project, along with `use_frameworks!`, you may encounter an error with `RNFirebase`. To avoid this, add `$RNFirebaseAsStaticFramework = true` at the top of your `Podfile`. 

[iOS] - For `Cycle inside FBReactNativeSpec` errors add the following to your podfile (https://github.com/facebook/react-native/issues/31034#issuecomment-812564390).
```
  post_install do |installer|
    react_native_post_install(installer)
    
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
      end
      
      if (target.name&.eql?('FBReactNativeSpec'))
        target.build_phases.each do |build_phase|
          if (build_phase.respond_to?(:name) && build_phase.name.eql?('[CP-User] Generate Specs'))
            target.build_phases.move(build_phase, 0)
          end
        end
      end
    end
  end
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
