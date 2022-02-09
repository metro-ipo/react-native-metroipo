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
      setResult(String(error));
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.pageWrap}>
        <Text>Result: {result}</Text>
        <TextInput
          value={codeInput}
          onChangeText={(text) => setCodeInput(text.trim())}
          style={[styles.textField]}
          placeholder="Code"
          placeholderTextColor="#98A9BC"
          maxLength={4}
          autoFocus={true}
          textContentType={'oneTimeCode'}
          keyboardType={'number-pad'}
          autoCapitalize={'none'}
          disableFullscreenUI={true}
          selectionColor="#4D7CFE"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageWrap: {
    paddingLeft: 16,
    paddingRight: 16,
    width: '100%',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4C35E6',
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  textField: {
    textAlign: 'center',
    fontSize: 32,
    letterSpacing: 0,
    height: 'auto',
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#CCCCCC',
    backgroundColor: 'transparent',
    marginTop: 5,
  }
});
