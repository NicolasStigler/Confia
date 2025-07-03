import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchGetWorkerMe, fetchUpdateWorkerImage, fetchUpdateWorkerProfile } from "../../api/api";
import NoPhotoImage from "../../assets/images/avatar.png";

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [worker, setWorker] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadWorkerData = async () => {
      try {
        const data = await fetchGetWorkerMe();
        setWorker(data);
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setAge(data.age ? data.age.toString() : "");
        setImage(data.profileImage);
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar la información del perfil.");
      }
    };
    loadWorkerData();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/login");
  };

  const handleSaveProfile = async () => {
    const workerProfileToUpdate = {
      firstname,
      lastname,
      age: parseInt(age, 10),
    };
    try {
      const updatedWorker = await fetchUpdateWorkerProfile(workerProfileToUpdate);
      setWorker(updatedWorker);
      Alert.alert("Perfil guardado");
      setEditing(false);
    } catch (error) {
      Alert.alert("Error", "El perfil no se pudo guardar");
    }
  };

  const handleSaveImage = async () => {
    if (image) {
      try {
        await fetchUpdateWorkerImage(image);
        Alert.alert("Foto de perfil actualizada");
      } catch (error) {
        Alert.alert("Error", "No se pudo actualizar la foto de perfil");
      }
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  if (!worker) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: "#fff" }}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <TouchableOpacity onPress={handlePickImage} onLongPress={handleTakePhoto}>
              <Image
                source={image ? { uri: image } : NoPhotoImage}
                style={styles.avatar}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handlePickImage} style={{ marginBottom: 8 }}>
            <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>Cambiar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTakePhoto} style={{ marginBottom: 8 }}>
            <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>Tomar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveImage} style={{ marginBottom: 8 }}>
            <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>Guardar foto</Text>
          </TouchableOpacity>
          {editing ? (
            <>
              <TextInput
                style={styles.input}
                value={firstname}
                onChangeText={setFirstname}
                placeholder="First Name"
                placeholderTextColor="#B9D4E8"
              />
              <TextInput
                style={styles.input}
                value={lastname}
                onChangeText={setLastname}
                placeholder="Last Name"
                placeholderTextColor="#B9D4E8"
              />
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Age"
                placeholderTextColor="#B9D4E8"
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Guardar Perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={() => setEditing(false)}>
                <Text style={styles.saveButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.profileName}>{worker.firstname} {worker.lastname}</Text>
              <Text style={styles.memberSince}>
                Miembro desde {worker.createdAt ? new Date(worker.createdAt).getFullYear() : "2025"}
              </Text>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <ProfileRow label="Email" value={worker.email || "-"} />
          <ProfileRow label="Phone Number" value={worker.phone || "-"} />
          <ProfileRow label="Address" value={worker.direccion || "-"} />
          <ProfileRow label="Distrito" value={worker.distrito_vive?.name || "-"} />
          <ProfileRow label="Edad" value={worker.age ? worker.age.toString() : "-"} />
          <ProfileRow label="Rol" value={worker.role || "-"} />
          <ProfileRow label="Calificación Promedio" value={worker.averageRating ? worker.averageRating.toString() : "-"} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.labelText}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? "#fff" : "#fff"}
              trackColor={{ false: "#1C2830", true: "#1C2830" }}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.labelText}>Language</Text>
            <Text style={styles.valueText}>Spanish</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#F87171" style={{ marginRight: 10 }} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
        {editing ? null : (
          <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
            <Ionicons name="create-outline" size={22} color="#2563EB" style={{ marginRight: 10 }} />
            <Text style={[styles.editButtonText, { color: '#2563EB' }]}>Editar Perfil</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.labelText}>{label}</Text>
        <Text style={styles.valueText}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111A1F",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111A1F",
  },
  container: {
    paddingHorizontal: 18,
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#111A1F",
    minHeight: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    minHeight: 52,
  },
  headerBack: {
    paddingRight: 12,
    width: 32,
  },
  headerTitle: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
    lineHeight: 32,
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: "#F7EADB",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 136,
    height: 136,
    borderRadius: 68,
  },
  profileName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 18,
    color: "#B9D4E8",
    fontWeight: "400",
    marginBottom: 0,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 26,
  },
  labelText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
    marginBottom: 2,
  },
  valueText: {
    fontSize: 17,
    color: "#B9D4E8",
    fontWeight: "400",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#1C2830",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 12,
  },
  logoutText: {
    color: "#F87171",
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    alignSelf: 'center',
    backgroundColor: '#243B47',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#B9D4E8',
    borderRadius: 5,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: '#1C2830',
    alignSelf: 'center',
    fontSize: 18,
  },
  saveButton: {
    alignSelf: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});