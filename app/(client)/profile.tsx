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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchGetClientMe,
  fetchUpdateClientImage,
  fetchUpdateClientProfile,
} from "../../api/api"; // Adjust path as needed
import NoPhotoImage from "../../assets/images/avatar.png"; // Fallback image

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [client, setClient] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [age, setAge] = useState("");
  const [direccion, setDireccion] = useState("");
  const [distritoVive, setDistritoVive] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadClientData = async () => {
      try {
        const data = await fetchGetClientMe();
        setClient(data);
        setFirstname(data.firstname || "");
        setLastname(data.lastname || "");
        setAge(data.age ? String(data.age) : "");
        setDireccion(data.direccion || "");
        setDistritoVive(data.distrito_vive?.name || "");
        setImage(data.profileImage || null);
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar la información del perfil.");
      }
    };
    loadClientData();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/login");
  };

  const handleEditProfile = () => setEditing(true);
  const handleCancelEdit = () => {
    setEditing(false);
    if (client) {
      setFirstname(client.firstname || "");
      setLastname(client.lastname || "");
      setAge(client.age ? String(client.age) : "");
      setDireccion(client.direccion || "");
      setDistritoVive(client.distrito_vive?.name || "");
      setImage(client.profileImage || null);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await fetchUpdateClientProfile({
        firstname,
        lastname,
        age: parseInt(age, 10),
        direccion,
        distrito_vive: distritoVive,
      });
      setEditing(false);
      const updated = await fetchGetClientMe();
      setClient(updated);
      Alert.alert("Perfil actualizado");
    } catch (e) {
      Alert.alert("Error", "No se pudo actualizar el perfil");
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

  const handleSaveImage = async () => {
    if (image && image !== client?.profileImage) {
      try {
        await fetchUpdateClientImage(image);
        const updated = await fetchGetClientMe();
        setClient(updated);
        Alert.alert("Foto de perfil actualizada");
      } catch (e) {
        Alert.alert("Error", "No se pudo actualizar la foto de perfil");
      }
    }
  };

  if (!client) {
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
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.headerBack}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <TouchableOpacity
              onPress={handlePickImage}
              onLongPress={handleTakePhoto}
            >
              <Image
                source={image ? { uri: image } : NoPhotoImage}
                style={styles.avatar}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handlePickImage} style={{ marginBottom: 8 }}>
            <Text style={{ color: "#2563EB", fontWeight: "bold" }}>
              Cambiar foto
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTakePhoto} style={{ marginBottom: 8 }}>
            <Text style={{ color: "#2563EB", fontWeight: "bold" }}>
              Tomar foto
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveImage} style={{ marginBottom: 8 }}>
            <Text style={{ color: "#2563EB", fontWeight: "bold" }}>
              Guardar foto
            </Text>
          </TouchableOpacity>
          <Text style={styles.profileName}>
            {editing ? (
              <TextInput
                style={[
                  styles.profileName,
                  {
                    backgroundColor: "#222",
                    color: "#fff",
                    borderRadius: 8,
                    paddingHorizontal: 8,
                  },
                ]}
                value={firstname}
                onChangeText={setFirstname}
                placeholder="Nombre"
                placeholderTextColor="#B9D4E8"
              />
            ) : (
              `${client.firstname} ${client.lastname}`
            )}
          </Text>
          <Text style={styles.memberSince}>
            Miembro desde{" "}
            {client.createdAt
              ? new Date(client.createdAt).getFullYear()
              : "2025"}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {editing ? (
            <>
              <ProfileRow
                label="Nombre"
                value={firstname}
                editable
                onChangeText={setFirstname}
              />
              <ProfileRow
                label="Apellido"
                value={lastname}
                editable
                onChangeText={setLastname}
              />
              <ProfileRow
                label="Edad"
                value={age}
                editable
                onChangeText={setAge}
                keyboardType="numeric"
              />
              <ProfileRow
                label="Dirección"
                value={direccion}
                editable
                onChangeText={setDireccion}
              />
              <ProfileRow
                label="Distrito"
                value={distritoVive}
                editable
                onChangeText={setDistritoVive}
              />
            </>
          ) : (
            <>
              <ProfileRow label="Email" value={client.email || "-"} />
              <ProfileRow label="Phone Number" value={client.phone || "-"} />
              <ProfileRow label="Address" value={client.direccion || "-"} />
              <ProfileRow label="Distrito" value={client.distrito_vive?.name || "-"} />
              <ProfileRow label="Edad" value={client.age ? client.age.toString() : "-"} />
            </>
          )}
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
        {editing ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.logoutText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleCancelEdit}
            >
              <Text style={styles.logoutText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleEditProfile}
          >
            <Ionicons
              name="create-outline"
              size={22}
              color="#2563EB"
              style={{ marginRight: 10 }}
            />
            <Text style={[styles.logoutText, { color: "#2563EB" }]}>
              Editar Perfil
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#F87171"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({
  label,
  value,
  editable,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  editable?: boolean;
  onChangeText?: (v: string) => void;
  keyboardType?: string;
}) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.labelText}>{label}</Text>
        {editable ? (
          <TextInput
            style={{
              color: "#fff",
              backgroundColor: "#222",
              borderRadius: 8,
              paddingHorizontal: 8,
              marginTop: 2,
              minWidth: 120,
            }}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            placeholder={label}
            placeholderTextColor="#B9D4E8"
          />
        ) : (
          <Text style={styles.valueText}>{value}</Text>
        )}
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
});