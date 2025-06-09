import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from '../components/Icons';

interface AppCustomNamedColors {
  appTextPrimary?: string;
  appTextSecondary?: string;
}

type ExtendedAppTheme = ReturnType<typeof useTheme> & {
  colors: AppCustomNamedColors & ReturnType<typeof useTheme>['colors'];
};

export default function ProviderRegisterScreen() {
  const theme = useTheme() as ExtendedAppTheme;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [qualifications, setQualifications] = useState('');

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    container: { flex: 1 },
    appbarHeader: {
      backgroundColor: theme.colors.background,
      elevation: 0,
    },
    appbarContentTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    scrollView: { flexGrow: 1 },
    contentContainer: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 30,
    },
    headline: {
      color: theme.colors.onBackground,
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 24,
    },
    inputContainer: {
      marginBottom: 18,
    },
    textInput: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    textArea: {
      backgroundColor: theme.colors.surfaceVariant,
      minHeight: 120,
      paddingTop: 8,
    },
    registerButton: {
      height: 52,
      borderRadius: 12,
    },
    registerButtonLabel: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    loginTextContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
    },
    loginTextPrompt: {
      color: theme.colors.appTextSecondary || theme.colors.onSurfaceVariant,
      fontSize: 14,
      textAlign: 'center',
    },
    loginLink: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      marginLeft: 4,
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Appbar.Header style={styles.appbarHeader} mode="center-aligned" dense={true} statusBarHeight={0}>
        <Appbar.Action icon={() => <ArrowLeftIcon color={theme.colors.onBackground} size={24} />} onPress={() => router.back()} rippleColor="transparent" />
        <Appbar.Content title="Confia Providers" color={theme.colors.onBackground} titleStyle={styles.appbarContentTitle} />
        <View style={{ width: 48 }} />{/* Spacer */}
      </Appbar.Header>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.headline}>Join our network of trusted professionals</Text>
        {/* ... (TextInputs) ... */}
        <View style={styles.inputContainer}><TextInput label="Email or Phone" value={email} onChangeText={setEmail} {...commonInputProps} /></View>
        <View style={styles.inputContainer}><TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry {...commonInputProps} /></View>
        <View style={styles.inputContainer}><TextInput label="Service Area" value={serviceArea} onChangeText={setServiceArea} {...commonInputProps} /></View>
        <View style={styles.inputContainer}><TextInput label="Qualifications" value={qualifications} onChangeText={setQualifications} multiline numberOfLines={4} {...commonInputProps} style={[styles.textInput, styles.textArea]} /></View>

        <Button mode="contained" onPress={() => console.log('Register Provider')} style={styles.registerButton} labelStyle={styles.registerButtonLabel} contentStyle={{ height: '100%' }}>Register</Button>
        <View style={styles.loginTextContainer}>
          <Text style={styles.loginTextPrompt}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}