import { router } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const HEADER_IMAGE_URL_CLIENT = '[https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80](https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80)';
const USE_IMAGE_PLACEHOLDER = false; // Set to false to use the actual URL above

// Consistent type definition with other screens
interface AppCustomNamedColors {
  appTextPrimary?: string;
  appTextSecondary?: string;
  clientPageBg?: string;
  clientInputBg?: string;
  clientPlaceholder?: string;
  clientButtonBg?: string;
  clientButtonText?: string;
}

type ExtendedAppTheme = ReturnType<typeof useTheme> & {
  colors: AppCustomNamedColors & ReturnType<typeof useTheme>['colors'];
};

export default function ClientRegisterScreen() {
  const theme = useTheme() as ExtendedAppTheme;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Use colors directly from the theme, falling back to hardcoded if necessary
  // (though ideally, all these would be defined in themes.ts)
  const currentClientColors = {
    background: theme.colors.clientPageBg || (theme.dark ? '#111c22' : '#FFFFFF'),
    inputBackground: theme.colors.clientInputBg || (theme.dark ? '#243b47' : '#F0F0F0'),
    placeholderText: theme.colors.clientPlaceholder || (theme.dark ? '#93b6c8' : '#757575'),
    buttonBackground: theme.colors.clientButtonBg || (theme.dark ? '#19a1e5' : '#007AFF'),
    buttonText: theme.colors.clientButtonText || (theme.dark ? '#141b1f' : '#FFFFFF'),
    textPrimary: theme.colors.onBackground, // General text from main theme
    textSecondary: theme.colors.appTextSecondary || theme.colors.onSurfaceVariant, // Use appTextSecondary
  };


  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: currentClientColors.background },
    container: { flex: 1 },
    scrollView: { flexGrow: 1 },
    headerImageContainer: { width: '100%', aspectRatio: 16 / 9, minHeight: 250, maxHeight: 300 },
    headerImage: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: USE_IMAGE_PLACEHOLDER ? theme.colors.surfaceVariant : 'transparent',
    },
    contentContainer: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 },
    welcomeTitle: {
      color: currentClientColors.textPrimary,
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8,
    },
    welcomeSubtitle: {
      color: currentClientColors.textPrimary,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 32,
      lineHeight: 24,
    },
    inputContainer: { marginBottom: 18 },
    textInput: { backgroundColor: currentClientColors.inputBackground },
    bottomPartContainer: { paddingHorizontal: 24, paddingVertical: 16, paddingBottom: Platform.OS === 'ios' ? 30 : 24 },
    registerButton: {
      height: 52,
      borderRadius: 12,
      backgroundColor: currentClientColors.buttonBackground,
    },
    registerButtonLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: currentClientColors.buttonText,
    },
        loginTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24, // Space above this text
    },
    loginTextPrompt: {
      color: currentClientColors.placeholderText, // Using placeholder color for this link text
      fontSize: 14,
    },
    loginLink: {
      color: currentClientColors.placeholderText, // Link can be same color or slightly different
      fontSize: 14,
      fontWeight: 'bold', // Often links are bolder
      textDecorationLine: 'underline',
      marginLeft: 4,
    },
  });

    const clientTextInputTheme = {
    colors: {
      primary: theme.colors.primary, // Focused outline color (can be main theme primary)
      outline: currentClientColors.inputBackground, // Resting outline color (blend with input bg)
      onSurface: currentClientColors.textPrimary, // Text you type inside the input
      onSurfaceVariant: currentClientColors.placeholderText, // Placeholder/label text color
    }
  };

  const commonInputPropsClient = {
    mode: "outlined" as "outlined", // Use outlined mode for the desired animation
    style: styles.textInput,
    outlineStyle: { borderRadius: 12 }, // Match input field's rounding
    textColor: currentClientColors.textPrimary, // Text color when typing
    theme: clientTextInputTheme, // Apply specific theme for input states
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }} // Ensure ScrollView can expand
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerImageContainer}>
          {USE_IMAGE_PLACEHOLDER ? (
            <View style={styles.headerImage} />
          ) : (
            <ImageBackground
              // source={HEADER_IMAGE_LOCAL} // If using local image
              source={{ uri: HEADER_IMAGE_URL_CLIENT }}
              style={styles.headerImage}
              resizeMode="cover" // Or "contain" depending on your image
            />
          )}
        </View>

        <View style={[styles.contentContainer, {flex: 1}] /* Make content take available space */}>
          <Text style={styles.welcomeTitle}>Welcome to Confia</Text>
          <Text style={styles.welcomeSubtitle}>
            Find trusted professionals for your home service needs.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              label="Email or Phone"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              {...commonInputPropsClient}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              {...commonInputPropsClient}
            />
          </View>
        </View>
        {/* Moved Button and Link outside the main content part of ScrollView for distinct bottom placement */}
        <View style={styles.bottomPartContainer}>
            <Button
                onPress={() => console.log('Register Client')}
                style={styles.registerButton}
                labelStyle={styles.registerButtonLabel}
                // mode="contained" is not strictly needed if fully styling
                contentStyle={{ height: '100%' }} // Center text in button
            >
                Register
            </Button>
            <View style={styles.loginTextContainer}>
                <Text style={styles.loginTextPrompt}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text style={styles.loginLink}>Log in</Text>
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}