import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from '../components/Icons';

interface CustomThemeColors {
  secondaryText: string;
}

type ExtendedTheme = ReturnType<typeof useTheme> & { colors: CustomThemeColors & ReturnType<typeof useTheme>['colors'] };

export default function LoginScreen() {
  const theme = useTheme() as ExtendedTheme;
  const params = useLocalSearchParams();
  const userType = params.userType || 'unknown';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginButtonColor = theme.colors.primary; // Use specific client button color

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    container: { flex: 1 },
    appbarHeader: { backgroundColor: theme.colors.background, elevation: 0 },
    appbarContentTitle: { fontSize: 18, fontWeight: 'bold' },
    scrollView: { flexGrow: 1 },
    contentContainer: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 30,
    },
    headline: {
      color: theme.colors.onBackground,
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 32, // More space after headline
    },
    inputContainer: { marginBottom: 18 },
    textInput: { backgroundColor: theme.colors.surfaceVariant },
    forgotPasswordLink: {
      color: theme.colors.primary, // Use a distinct, interactive color
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'left',
      paddingVertical: 8, // Make it easier to tap
    },
    bottomContent: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      marginTop: 'auto', // Push to the bottom
    },
    loginButton: {
      height: 52,
      borderRadius: 26, // Fully rounded
      backgroundColor: loginButtonColor, // Specific blue color for login button
    },
    loginButtonLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.appTextSecondary,
    },
  });

  const textInputTheme = {
    colors: {
      primary: theme.colors.primary,
      outline: theme.colors.surfaceVariant,
      onSurface: theme.colors.appTextPrimary || theme.colors.onSurface,
      onSurfaceVariant: theme.colors.appTextSecondary || theme.colors.onSurfaceVariant,
    }
  };

  const commonInputProps = {
    mode: "outlined" as "outlined",
    style: styles.textInput,
    outlineStyle: { borderRadius: 12 },
    textColor: theme.colors.appTextPrimary || theme.colors.onSurface,
    theme: textInputTheme,
  };

  const handleLogin = () => {
    console.log('Login attempt:');
    console.log('  Email:', email);
    console.log('  Password:', password);
    console.log('  User Type:', userType);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Appbar.Header style={styles.appbarHeader} mode="center-aligned" dense={true} statusBarHeight={0}>
        <Appbar.Action
          icon={() => <ArrowLeftIcon color={theme.colors.onBackground} size={24} />}
          onPress={() => router.back()}
          rippleColor="transparent"
        />
        <Appbar.Content title="Confia" color={theme.colors.onBackground} titleStyle={styles.appbarContentTitle}/>
        <View style={{ width: 48 }} />{/* Spacer */}
      </Appbar.Header>

      <View style={[styles.container, { paddingBottom: 20 }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.headline}>Welcome back</Text>

          <View style={styles.inputContainer}>
            <TextInput
              label="Email or phone"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              {...commonInputProps}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              {...commonInputProps}
            />
          </View>
          <TouchableOpacity onPress={() => console.log('Forgot Password pressed')}>
            <Text style={styles.forgotPasswordLink}>Forgot password?</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomContent}>
          <Button
            onPress={handleLogin}
            style={styles.loginButton}
            labelStyle={styles.loginButtonLabel}
            contentStyle={{ height: '100%' }}
          >
            Log in
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}