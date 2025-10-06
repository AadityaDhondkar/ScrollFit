// ScrollFit/App.tsx

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, Button, Modal, View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const App = () => {
  const [scrollCount, setScrollCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const devices = useCameraDevices();
  const device = devices.front; // use front camera

  // Ask for camera permission once when app starts
  useEffect(() => {
    const requestPermission = async () => {
      const status = await Camera.requestCameraPermission();
      if (status === 'authorized') {
        setHasPermission(true);
      } else {
        Alert.alert('Camera permission required', 'Please enable it in settings.');
      }
    };
    requestPermission();
  }, []);

  const handleScroll = () => {
    const newCount = scrollCount + 1;
    setScrollCount(newCount);
    if (newCount >= 5) {
      setIsLocked(true);
    }
  };

  const unlockScrolls = () => {
    setScrollCount(0);
    setIsLocked(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView source={{ uri: 'https://www.instagram.com/' }} />
      <Button title="Next Reel (simulate scroll)" onPress={handleScroll} />

      {/* Push-up camera overlay */}
      <Modal visible={isLocked} transparent animationType="slide">
        <View style={styles.overlay}>
          {hasPermission && device ? (
            <Camera
              style={styles.camera}
              device={device}
              isActive={true}
            />
          ) : (
            <Text style={styles.text}>Requesting camera permission...</Text>
          )}
          <View style={styles.overlayText}>
            <Text style={styles.text}>Do 5 push-ups to unlock more scrolls! 💪</Text>
            <Button title="Done (for now)" onPress={unlockScrolls} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayText: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default App;
