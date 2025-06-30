import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchGetClientMe } from "../../api/api"; // Adjust path as needed
import NoPhotoImage from "../../assets/images/avatar.png"; // Fallback image

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [client, setClient] = useState<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadClientData = async () => {
      try {
        const data = await fetchGetClientMe();
        setClient(data);
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar la información del perfil.");
      }
    };
    loadClientData();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    navigation.navigate("Login" as never);
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
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.headerBack} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Image
              source={client.profileImage ? { uri: client.profileImage } : NoPhotoImage}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.profileName}>{client.firstname} {client.lastname}</Text>
          <Text style={styles.memberSince}>
            Miembro desde {client.createdAt ? new Date(client.createdAt).getFullYear() : "2025"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <ProfileRow label="Email" value={client.email || "-"} />
          <ProfileRow label="Phone Number" value={client.phone || "-"} />
          <ProfileRow label="Address" value={client.direccion || "-"} />
          <ProfileRow label="Distrito" value={client.distrito_vive?.name || "-"} />
          <ProfileRow label="Edad" value={client.age ? client.age.toString() : "-"} />
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
});