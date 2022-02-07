import * as React from 'react';

import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MetroIpo, MetroIpoConfig } from 'react-native-metroipo';

export default function App() {
  const [result, setResult] = React.useState("Awaiting Initialization");
  const [codeInput, setCodeInput] = React.useState("");
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

  const startSdk = async (code: String) => {
    try {
      const config = MetroIpoConfig.setDomain("https://admin.metroipo.com").setCode(code).build();
      const init = await MetroIpo.init(config);
      if (init.success) {
        setResult(init.message);
      }
      const res = await MetroIpo.startCapture();
      if (res.success) {
        setResult(res.message);
      }
    } catch (error) {
      setResult("Error: " + error);
    }
  }

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <TextInput
        maxLength={4}
        autoFocus={true}
        textContentType={'oneTimeCode'}
        keyboardType={'number-pad'}
        value={codeInput}
        autoCapitalize={'none'}
        disableFullscreenUI={true}
        placeholderTextColor="#98A9BC"
        selectionColor="#4D7CFE"
        style={[styles.textField]}
        placeholder="Code"
        onChangeText={(text) => setCodeInput(text.trim())}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          startSdk(codeInput)
        }}>
        <View>
          <Text style={styles.buttonText}>Start Signature Capture</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#000000',
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  textField: {
    textAlign: 'center',
    fontSize: 32,
    letterSpacing: 0,
    height: 'auto',
    width: '100%',
    color: '#5E6671',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#707070',
    backgroundColor: 'transparent',
    marginTop: 5,
  }
});
