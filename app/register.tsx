import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from '../components/Icons';

interface AppCustomNamedColors {
  appTextPrimary?: string;
  appTextSecondary?: string;
  clientPageBg?: string;
  clientInputBg?: string;
  clientPlaceholder?: string;
  clientButtonBg?: string;
  clientButtonText?: string;
  surfaceVariant?: string;
  onBackground?: string; // Ensure this is in your theme
}

type ExtendedAppTheme = ReturnType<typeof useTheme> & {
  colors: AppCustomNamedColors & ReturnType<typeof useTheme>['colors'];
};


export default function ClientRegisterScreen() {
  const theme = useTheme() as ExtendedAppTheme;
  const params = useLocalSearchParams();
  const isWorker = params.isWorker === 'true';

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');

  const currentClientColors = {
    background: theme.colors.clientPageBg || (theme.dark ? '#111c22' : '#FFFFFF'),
    inputBackground: theme.colors.clientInputBg || (theme.dark ? '#243b47' : '#F0F0F0'),
    placeholderText: theme.colors.clientPlaceholder || (theme.dark ? '#93b6c8' : '#757575'),
    buttonText: theme.colors.clientButtonText || (theme.dark ? '#141b1f' : '#FFFFFF'),
    textPrimary: theme.colors.onBackground || '#000000',
    textSecondary: theme.colors.appTextSecondary || theme.colors.onSurfaceVariant,
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: currentClientColors.background },
    keyboardAvoidingView: { flex: 1 },
    appbarHeader: { backgroundColor: currentClientColors.background, elevation: 0 },
    appbarContentTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.onBackground },
    scrollView: { flex: 1 }, // Changed flexGrow to flex:1
    contentContainerScrollView: { // Renamed
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 20, // Reduced as button is outside
      flexGrow: 1,
    },
    welcomeTitle: {
      color: currentClientColors.textPrimary,
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8,
    },
    welcomeSubtitle: {
      color: currentClientColors.textPrimary,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 24,
    },
    inputContainer: { marginBottom: 18, width: '100%' },
    textInput: { backgroundColor: currentClientColors.inputBackground },
    bottomPartContainer: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      paddingBottom: Platform.OS === 'ios' ? 30 : 24,
      borderTopWidth: Platform.OS === 'android' ? 1 : 0,
      borderTopColor: theme.colors.surfaceVariant,
      backgroundColor: currentClientColors.background,
    },
    registerButton: {
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.colors.primary,
    },
    registerButtonLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.appTextSecondary || theme.colors.onPrimary,
    },
    loginTextContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
    },
    loginTextPrompt: {
      color: currentClientColors.placeholderText,
      fontSize: 14,
    },
    loginLink: {
      color: currentClientColors.placeholderText,
      fontSize: 14,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      marginLeft: 4,
    },
  });

  const textInputTheme = {
    colors: {
      primary: theme.colors.primary,
      outline: currentClientColors.inputBackground,
      onSurface: currentClientColors.textPrimary,
      onSurfaceVariant: currentClientColors.placeholderText,
    }
  };

  const commonInputPropsClient = {
    mode: "outlined" as "outlined",
    style: styles.textInput,
    outlineStyle: { borderRadius: 12 },
    textColor: currentClientColors.textPrimary,
    theme: textInputTheme,
  };

  const handleRegister = () => {
    const registrationData = {
      firstname,
      lastname,
      age: parseInt(age, 10),
      email,
      password,
      address,
      isWorker: isWorker.toString(),
    };
    console.log('Registering User:', registrationData);
  };

  // Calculate keyboardVerticalOffset if Appbar is present
  // This is a rough estimation, you might need to measure the Appbar height dynamically if it's variable
  const appbarHeight = 56; // Typical height for Appbar.Header, adjust if yours is different
  const keyboardVerticalOffsetValue = Platform.OS === 'ios' ? appbarHeight : 0;


  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Appbar.Header style={styles.appbarHeader} mode="center-aligned" dense={true} statusBarHeight={0}>
        <Appbar.Action
          icon={() => <ArrowLeftIcon color={theme.colors.onBackground || '#000000'} size={24} />}
          onPress={() => router.back()}
          rippleColor="transparent"
        />
        <Appbar.Content title="Create Account" color={theme.colors.onBackground} titleStyle={styles.appbarContentTitle}/>
        <View style={{ width: 48 }} />
      </Appbar.Header>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffsetValue}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerScrollView}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.welcomeTitle}>Welcome to Confia</Text>
          <Text style={styles.welcomeSubtitle}>
            {isWorker ? "Join our network of trusted professionals." : "Find trusted professionals for your home service needs."}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput label="First Name" value={firstname} onChangeText={setFirstname} autoCapitalize="words" {...commonInputPropsClient} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput label="Last Name" value={lastname} onChangeText={setLastname} autoCapitalize="words" {...commonInputPropsClient} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput label="Age" value={age} onChangeText={setAge} keyboardType="numeric" {...commonInputPropsClient} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" {...commonInputPropsClient} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry {...commonInputPropsClient} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput label="Address" value={address} onChangeText={setAddress} autoCapitalize="words" {...commonInputPropsClient} />
          </View>
        </ScrollView>
        <View style={styles.bottomPartContainer}>
          <Button onPress={handleRegister} style={styles.registerButton} labelStyle={styles.registerButtonLabel} contentStyle={{ height: '100%' }}>
            Register
          </Button>
          <View style={styles.loginTextContainer}>
            <Text style={styles.loginTextPrompt}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}