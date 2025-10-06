// ScrollFit/App.tsx

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, Button, Modal, View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { StatusBar } from 'react-native';


const App = () => {
  const [scrollCount, setScrollCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // ✅ useCameraDevices now returns an array
  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === 'front'); // pick front camera manually

  // ✅ requestCameraPermission() now returns an object
  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      if (permission === 'granted') {
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
    <SafeAreaView style={{ flex: 1,paddingTop: StatusBar.currentHeight }}>
      <StatusBar
    barStyle="dark-content"   // use "light-content" if you have a dark background
    backgroundColor="transparent"  // optional: makes it blend with your app
    translucent={true}  // ensures content doesn’t get pushed down
    hidden={false}  // very important — ensures status bar is visible
  />
      <WebView source={{ uri: 'https://www.instagram.com/' }} />
      <Button title="Next Reel (simulate scroll)" onPress={handleScroll} />

      <Modal visible={isLocked} transparent animationType="slide">
        <View style={styles.overlay}>
          {hasPermission ? (
            device ? (
              <>
                <Camera
                  style={styles.camera}
                  device={device}
                  isActive={true}
                />
                <View style={styles.overlayText}>
                  <Text style={styles.text}>Do 5 push-ups to unlock more scrolls! 💪</Text>
                  <Button title="Done (for now)" onPress={unlockScrolls} />
                </View>
              </>
            ) : (
              <Text style={styles.text}>Loading camera device...</Text>
            )
          ) : (
            <Text style={styles.text}>Requesting camera permission...</Text>
          )}
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
