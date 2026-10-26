import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, ScrollView, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

const INITIAL_DEFAULT = 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4';
const INITIAL_SAG = 'https://www.w3schools.com/html/mov_bbb.mp4';
const INITIAL_SOL = 'https://media.w3.org/2010/05/sintel/trailer.mp4';
const INITIAL_GUL = 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4';

export default function App() {
  const videoRef = useRef(null);
  
  const [defaultVideo, setDefaultVideo] = useState(INITIAL_DEFAULT);
  const [sagVideo, setSagVideo] = useState(INITIAL_SAG);
  const [solVideo, setSolVideo] = useState(INITIAL_SOL);
  const [gulVideo, setGulVideo] = useState(INITIAL_GUL);
  const [currentVideo, setCurrentVideo] = useState(defaultVideo);
  
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('İzin Gerekli', 'Kendi videolarınızı eklemek için galeri iznine ihtiyacımız var.');
        }
      }
    })();
  }, []);

  const playAction = (videoUrl) => {
    setCurrentVideo(videoUrl);
  };

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish && currentVideo !== defaultVideo) {
      setCurrentVideo(defaultVideo);
    }
  };

  const pickVideoFor = async (actionName) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      
      if (actionName === 'SABIT') { setDefaultVideo(selectedUri); setCurrentVideo(selectedUri); }
      if (actionName === 'SAG') setSagVideo(selectedUri);
      if (actionName === 'SOL') setSolVideo(selectedUri);
      if (actionName === 'GUL') setGulVideo(selectedUri);
      
      Alert.alert("Başarılı", `${actionName} aksiyonu güncellendi.`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yüz Kontrolü</Text>
        <TouchableOpacity style={styles.settingsButtonIcon} onPress={() => setIsSettingsVisible(true)}>
          <Text style={styles.settingsButtonText}>⚙ Ayarlar</Text>
        </TouchableOpacity>
      </View>

      {/* Video Player Card */}
      <View style={styles.card}>
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: currentVideo }}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping={currentVideo === defaultVideo} 
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />
        </View>
        <Text style={styles.videoStatusText}>
          {currentVideo === defaultVideo ? "Sabit bakış aktif" : "Eylem oynatılıyor..."}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.controlsContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.actionButton, styles.primaryAccent]} onPress={() => playAction(solVideo)}>
            <Text style={styles.actionText}>← SOL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.primaryAccent]} onPress={() => playAction(sagVideo)}>
            <Text style={styles.actionText}>SAĞ →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryAccent]} onPress={() => playAction(gulVideo)}>
            <Text style={styles.actionText}>☺ GÜL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.neutralButton]} onPress={() => playAction(defaultVideo)}>
            <Text style={styles.actionText}>◎ BİTİR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Credits */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Yapımcı: Macrosoft Yazılım - Sedat Nas</Text>
      </View>

      {/* Settings Modal */}
      <Modal visible={isSettingsVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Video Ayarları</Text>
            <TouchableOpacity onPress={() => setIsSettingsVisible(false)}>
              <Text style={styles.closeButton}>Kapat</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <Text style={styles.modalSubtitle}>Cihaz galerisinden video seçerek tuşlara atayın.</Text>
            
            <TouchableOpacity style={styles.settingsCard} onPress={() => pickVideoFor('SABIT')}>
              <Text style={styles.settingsCardTitle}>Sabit Bakış (Varsayılan)</Text>
              <Text style={styles.settingsCardAction}>Değiştir ➔</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsCard} onPress={() => pickVideoFor('SAG')}>
              <Text style={styles.settingsCardTitle}>SAĞ Tuşu Videosu</Text>
              <Text style={styles.settingsCardAction}>Değiştir ➔</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsCard} onPress={() => pickVideoFor('SOL')}>
              <Text style={styles.settingsCardTitle}>SOL Tuşu Videosu</Text>
              <Text style={styles.settingsCardAction}>Değiştir ➔</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsCard} onPress={() => pickVideoFor('GUL')}>
              <Text style={styles.settingsCardTitle}>GÜL Tuşu Videosu</Text>
              <Text style={styles.settingsCardAction}>Değiştir ➔</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7' }, // Soft cream background
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 15 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#333' },
  settingsButtonText: { fontSize: 16, color: '#007BFF', fontWeight: '600' }, // Electric blue
  
  card: { backgroundColor: 'white', marginHorizontal: 20, borderRadius: 24, padding: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 5, marginBottom: 20 },
  videoContainer: { height: 300, borderRadius: 16, overflow: 'hidden', backgroundColor: '#eee' },
  video: { width: '100%', height: '100%' },
  videoStatusText: { textAlign: 'center', marginTop: 12, marginBottom: 5, color: '#666', fontWeight: '500' },

  controlsContainer: { paddingHorizontal: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  actionButton: { flex: 1, paddingVertical: 22, marginHorizontal: 6, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  
  primaryAccent: { backgroundColor: '#FF7F50' }, // Coral
  secondaryAccent: { backgroundColor: '#007BFF' }, // Electric Blue
  neutralButton: { backgroundColor: '#E0E0E0' },
  actionText: { color: 'white', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  
  footer: { position: 'absolute', bottom: 30, width: '100%', alignItems: 'center' },
  footerText: { color: '#999', fontSize: 12, fontWeight: '500' },

  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: '#FDFBF7' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#eee' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  closeButton: { fontSize: 16, color: '#FF7F50', fontWeight: 'bold' },
  modalBody: { padding: 20 },
  modalSubtitle: { color: '#666', marginBottom: 20 },
  settingsCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  settingsCardTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  settingsCardAction: { color: '#007BFF', fontWeight: 'bold' }
});