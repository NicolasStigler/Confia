import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo and have Ionicons
import { Image } from 'expo-image';
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

// Sample data - replace with your actual data source
const featuredServicesData = [
  { id: '1', title: 'Home Repair', image: require('@/assets/images/home-repair.png') }, // Replace with your actual image
  { id: '2', title: 'Pet Care', image: require('@/assets/images/pet-care.png') }, // Replace with your actual image
  { id: '3', title: 'Personal Care', image: require('@/assets/images/personal-care.png') }, // Replace with your actual image
];

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Confia</ThemedText>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={Platform.OS === 'ios' ? '#000' : '#fff'} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search for services"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Featured Services</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {featuredServicesData.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <Image source={service.image} style={styles.serviceImage} />
                <ThemedText style={styles.serviceTitle}>{service.title}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>

        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Special Offers</ThemedText>
          <TouchableOpacity style={styles.specialOfferCard}>
            <Image source={require('@/assets/images/special-offer.png')} style={styles.specialOfferImage} />
            <View style={styles.specialOfferTextContainer}>
              <ThemedText type="defaultSemiBold" style={styles.specialOfferMainText}>Get 20% off your first booking</ThemedText>
              <ThemedText style={styles.specialOfferSubText}>Use code WELCOME20 at checkout</ThemedText>
              <ThemedText style={styles.specialOfferSubText}>Limited time offer</ThemedText>
            </View>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117', // Dark background color from image
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Adjust for status bar
    paddingBottom: 10,
  },
  headerTitle: {
    color: '#FFFFFF', // White text
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937', // Darker search bar background
    borderRadius: 25,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF', // White text
    fontSize: 16,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'transparent', // Ensure sections don't have their own background unless intended
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFFFFF', // White text
  },
  horizontalScroll: {
    paddingRight: 20, // Ensure last card is not cut off
  },
  serviceCard: {
    backgroundColor: '#1F2937', // Card background
    borderRadius: 15,
    width: 150,
    marginRight: 15,
    overflow: 'hidden', // Ensure image corners are rounded
  },
  serviceImage: {
    width: '100%',
    height: 100,
    // Ensure you have images with appropriate aspect ratio or adjust height
  },
  serviceTitle: {
    padding: 10,
    color: '#FFFFFF', // White text
    fontSize: 16,
    textAlign: 'center',
  },
  specialOfferCard: {
    backgroundColor: '#1F2937', // Card background
    borderRadius: 15,
    overflow: 'hidden',
  },
  specialOfferImage: {
    width: '100%',
    height: 180, // Adjust as needed
  },
  specialOfferTextContainer: {
    padding: 15,
  },
  specialOfferMainText: {
    color: '#FFFFFF', // White text
    fontSize: 18,
    marginBottom: 5,
  },
  specialOfferSubText: {
    color: '#D1D5DB', // Lighter gray text
    fontSize: 14,
  },
});