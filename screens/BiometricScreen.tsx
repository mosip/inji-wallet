import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import Constants  from 'expo-constants';
import  * as  LocalAuthentication from 'expo-local-authentication';
import { Icon } from 'react-native-elements';
import { Column, Text } from '../components/ui';
import { Colors } from '../components/ui/styleUtils';
import { RootRouteProps } from '../routes';
import { useBiometricScreen } from './BiometricScreenController';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 60,
    backgroundColor: '#056ecf',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 30,
    color: '#fff',
  },
});

export const BiometricScreen: React.FC<RootRouteProps> = (props) => {
  const controller = useBiometricScreen(props);
  const [savedFingerprints, setSavedFingerprints] = useState(null);
  const [results, setResults] = useState(null)

  const handleBiometricAuth = async () => {
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    setSavedFingerprints(savedBiometrics)
  }

  const scanFingerprint = async () => {
    let results = await LocalAuthentication.authenticateAsync();
    console.log('---------->RESULTS', results)
    if (results.success) {
      alert("success!");
    } else {
      alert("fail");
    }
  };

  return (
    <Column fill padding="32" backgroundColor={Colors.White}>
      <Text>Scan your finger</Text>
      <View style={styles.container}>
        <Text style={styles.text}>
          Fingerprints Saved?{' '}
          {savedFingerprints === true ? 'True' : 'False'}
        </Text>
        <TouchableOpacity
          onPress={scanFingerprint}
          style={styles.button}>
          <Text style={styles.buttonText}>SCAN</Text>
        </TouchableOpacity>
        <Text>{results}</Text>
      </View>
    </Column>
  );
};
