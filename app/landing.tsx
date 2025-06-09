import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Snackbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BriefcaseIcon, HouseIcon } from '../components/Icons';

interface CustomThemeColors {
  secondaryText: string;
}

type ExtendedTheme = ReturnType<typeof useTheme> & { colors: CustomThemeColors & ReturnType<typeof useTheme>['colors'] };

export default function LandingScreen() {
  const theme = useTheme() as ExtendedTheme;
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      justifyContent: 'space-between',
    },
    scrollViewContent: {
      paddingBottom: 20,
    },
    topContent: {
      paddingHorizontal: 16, // px-4
    },
    header: {
      alignItems: 'center',
      paddingVertical: 16, // p-4
      paddingBottom: 8,    // pb-2
    },
    headerTitle: {
      color: theme.colors.text, // text-white (in dark mode)
      fontSize: 18, // text-lg
      fontWeight: 'bold',
      textAlign: 'center',
    },
    welcomeTitle: {
      color: theme.colors.text,
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingBottom: 12, // pb-3
      paddingTop: 20,    // pt-5
    },
    welcomeSubtitle: {
      color: theme.colors.text, // Assuming primary text color, or use theme.colors.secondaryText for lighter
      fontSize: 16,
      textAlign: 'center',
      paddingBottom: 12, // pb-3
      paddingTop: 4,     // pt-1
    },
    roleSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16, // gap-4
      backgroundColor: theme.colors.background, // or theme.colors.surface for cards
      paddingHorizontal: 16, // px-4
      minHeight: 72,
      paddingVertical: 8, // py-2
      borderRadius: 8, // For selection indication later
      marginBottom: 10, // Spacing between role selectors
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedRole: {
      borderColor: theme.colors.primary,
    },
    iconContainer: {
      backgroundColor: theme.colors.surfaceVariant, // bg-[#2b3940]
      width: 48, // size-12
      height: 48,
      borderRadius: 8, // rounded-lg
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    roleTextContainer: {
      flex: 1, // Allow text to take available space
    },
    roleTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '500', // font-medium
    },
    roleDescription: {
      color: theme.colors.secondaryText, // text-[#9db3be]
      fontSize: 14,
    },
    bottomContent: {
      paddingHorizontal: 16, // px-4
      paddingVertical: 12,   // py-3
    },
    continueButton: {
      borderRadius: 24, // rounded-full
      // backgroundColor will be handled by Button's mode="contained" and theme
    },
    continueButtonContent: {
      height: 48,
    },
    continueButtonLabel: {
      fontSize: 16, // text-base
      fontWeight: 'bold',
      // color will be theme.colors.onPrimary
    },
    bottomSpacer: {
      height: 20, // h-5
      backgroundColor: theme.colors.background,
    },
    snackbar: {
      backgroundColor: theme.colors.errorContainer || theme.colors.error,
    },
    snackbarText: {
      color: theme.colors.onErrorContainer || theme.colors.onError,
    },
  });

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role === selectedRole ? null : role);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      setSnackbarVisible(true);
      return;
    }
    if (selectedRole === 'provider') {
      router.push('/provider-register');
    } else if (selectedRole === 'client') {
      router.push('/client-register');
    }
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
              style={[styles.roleSelector, selectedRole === 'provider' && styles.selectedRole]}
              onPress={() => handleRoleSelect('provider')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <BriefcaseIcon color={selectedRole === 'provider' ? theme.colors.primary : theme.colors.text} />
              </View>
              <View style={styles.roleTextContainer}>
                <Text style={[styles.roleTitle, selectedRole === 'provider' && { color: theme.colors.primary }]}>Provider</Text>
                <Text style={styles.roleDescription}>Offer your services and connect with clients</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleSelector, selectedRole === 'client' && styles.selectedRole]}
              onPress={() => handleRoleSelect('client')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <HouseIcon color={selectedRole === 'client' ? theme.colors.primary : theme.colors.text} />
              </View>
              <View style={styles.roleTextContainer}>
                <Text style={[styles.roleTitle, selectedRole === 'client' && { color: theme.colors.primary }]}>Client</Text>
                <Text style={styles.roleDescription}>Find and book trusted professionals for your needs</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.bottomContent}>
          <Button
            mode="contained"
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
        style={{ backgroundColor: theme.colors.surfaceVariant }}
      >
        <Text style={{color: theme.colors.text}}>Please select a role to continue.</Text>
      </Snackbar>
    </SafeAreaView>
  );
}