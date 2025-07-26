import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{ label: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);


  const apiUrl = 'http://192.168.0.222:8000/predict';

  const pickImage = async () => {
    setPrediction(null);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    setPrediction(null);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera is required!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const sendToAPI = async () => {
  if (!image) return;
  setLoading(true);
  setPrediction(null);

  try {

    const response = await fetch(image);
    const blob = await response.blob();
    

    const formData = new FormData();
    formData.append('file', blob, `image.${blob.type.split('/')[1] || 'jpg'}`); 

    console.log('Sending file of type:', blob.type);

    const res = await fetch(apiUrl, {
      method: 'POST',
      body: formData,

    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    setPrediction(data);
  } catch (err: any) {
    console.error('Error details:', err);
    alert("Prediction failed: " + (err.message || "Unknown error"));
  } finally {
    setLoading(false);
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌱 Green Guardian</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>
      {image && (
        <View style={styles.previewBox}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity style={styles.predictBtn} onPress={sendToAPI}>
            <Text style={styles.predictText}>Diagnose Plant</Text>
          </TouchableOpacity>
        </View>
      )}
      {loading && <ActivityIndicator size="large" color="#4caf50" style={{ marginTop: 20 }} />}
      {prediction && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            {prediction.label && prediction.label !== "Error"
              ? `Prediction: ${prediction.label}\nConfidence: ${(prediction.confidence * 100).toFixed(2)}%`
              : "Prediction failed"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 60, backgroundColor: "#f0f9f2" },
  header: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: "#388e3c" },
  buttonRow: { flexDirection: 'row', marginBottom: 20 },
  button: { backgroundColor: '#81c784', padding: 16, borderRadius: 8, marginHorizontal: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  previewBox: { marginTop: 8, alignItems: 'center' },
  image: { width: 250, height: 250, borderRadius: 16, marginTop: 8 },
  predictBtn: { backgroundColor: '#388e3c', padding: 12, borderRadius: 8, marginTop: 16 },
  predictText: { color: '#fff', fontWeight: 'bold' },
  resultBox: { marginTop: 24, backgroundColor: "#fff", padding: 24, borderRadius: 12, shadowColor: "#888", shadowOpacity: 0.1, shadowRadius: 6 },
  resultText: { fontSize: 20, color: "#333", textAlign: "center" }
});

