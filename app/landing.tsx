import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Snackbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BriefcaseIcon, HouseIcon } from '../components/Icons';

interface CustomThemeColors {
  secondaryText: string;
  disabledButton: string;
}

type ExtendedTheme = ReturnType<typeof useTheme> & {
  colors: CustomThemeColors & ReturnType<typeof useTheme>['colors'];
};

export default function LandingScreen() {
  const theme = useTheme() as ExtendedTheme;
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    container: { flex: 1, justifyContent: 'space-between' },
    scrollViewContent: { paddingBottom: 20 },
    topContent: { paddingHorizontal: 16 },
    header: { alignItems: 'center', paddingVertical: 16, paddingBottom: 8 },
    headerTitle: { color: theme.colors.text, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
    welcomeTitle: { color: theme.colors.text, fontSize: 28, fontWeight: 'bold', textAlign: 'center', paddingBottom: 12, paddingTop: 20 },
    welcomeSubtitle: { color: theme.colors.secondaryText, fontSize: 16, textAlign: 'center', paddingVertical: 8 },
    roleSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      paddingHorizontal: 16,
      minHeight: 72,
      paddingVertical: 8,
      borderRadius: 8,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedRole: { borderColor: theme.colors.primary },
    iconContainer: {
      backgroundColor: theme.colors.surfaceVariant,
      width: 48,
      height: 48,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    roleTextContainer: { flex: 1 },
    roleTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '500' },
    roleDescription: { color: theme.colors.secondaryText, fontSize: 14 },
    bottomContent: { paddingHorizontal: 16, paddingVertical: 12 },
    continueButton: {
      borderRadius: 24,
      backgroundColor: selectedRole ? theme.colors.primary : theme.colors.disabledButton,
    },
    continueButtonContent: { height: 48 },
    continueButtonLabel: { fontSize: 16, fontWeight: 'bold', color: theme.colors.onPrimary },
    bottomSpacer: { height: 20, backgroundColor: theme.colors.background },
  });

  const handleRoleSelect = (role: string) =>
    setSelectedRole(prev => (prev === role ? null : role));

  const handleContinue = () => {
    if (!selectedRole) {
      setSnackbarVisible(true);
      return;
    }
    const isWorker = selectedRole === 'provider' ? 'true' : 'false';
    router.push({ pathname: '/register', params: { isWorker } });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.topContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Confia</Text>
            </View>
            <Text style={styles.welcomeTitle}>Welcome to Confia</Text>
            <Text style={styles.welcomeSubtitle}>Choose your role to get started</Text>

            <TouchableOpacity
              style={[
                styles.roleSelector,
                selectedRole === 'provider' && styles.selectedRole,
              ]}
              onPress={() => handleRoleSelect('provider')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <BriefcaseIcon color={selectedRole === 'provider' ? theme.colors.primary : theme.colors.text} />
              </View>
              <View style={styles.roleTextContainer}>
                <Text style={[styles.roleTitle, selectedRole === 'provider' && { color: theme.colors.primary }]}>
                  Provider
                </Text>
                <Text style={styles.roleDescription}>
                  Offer your services and connect with clients
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleSelector,
                selectedRole === 'client' && styles.selectedRole,
              ]}
              onPress={() => handleRoleSelect('client')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <HouseIcon color={selectedRole === 'client' ? theme.colors.primary : theme.colors.text} />
              </View>
              <View style={styles.roleTextContainer}>
                <Text style={[styles.roleTitle, selectedRole === 'client' && { color: theme.colors.primary }]}>
                  Client
                </Text>
                <Text style={styles.roleDescription}>
                  Find and book trusted professionals for your needs
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.bottomContent}>
          <Button
            mode="contained"
            disabled={!selectedRole}
            onPress={handleContinue}
            style={styles.continueButton}
            contentStyle={styles.continueButtonContent}
            labelStyle={styles.continueButtonLabel}
          >
            Continue
          </Button>
          <View style={styles.bottomSpacer} />
        </View>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        <Text>Please select a role to continue.</Text>
      </Snackbar>
    </SafeAreaView>
  );
}