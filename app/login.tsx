import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Appbar, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from '../components/Icons';

const IMAGE_URL = 'https://img.freepik.com/free-vector/home-renomation-flat-composition-with-plumber-fixing-pipes-vector-illustration_1284-80776.jpg';

interface CustomThemeColors {
  secondaryText: string;
  appTextPrimary?: string;
  appTextSecondary?: string;
  surfaceVariant?: string;
  onBackground?: string;
  background?: string;
}

type ExtendedTheme = ReturnType<typeof useTheme> & { colors: CustomThemeColors & ReturnType<typeof useTheme>['colors'] };

export default function LoginScreen() {
  const theme = useTheme() as ExtendedTheme;
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const screenWidth = Dimensions.get('window').width;

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    keyboardAvoidingView: { flex: 1 },
    appbarHeader: { backgroundColor: theme.colors.background, elevation: 0 },
    appbarContentTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.onBackground },
    inlineImage: { width: screenWidth, height: 200, resizeMode: 'cover', marginLeft: -24 },
    innerContainer: { flex: 1 },
    scrollView: { flex: 1 },
    contentContainerScrollView: {
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 20,
      flexGrow: 1,
    },
    headline: {
      color: theme.colors.onBackground,
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingTop: 16,
      marginBottom: 16,
    },
    inputContainer: { marginBottom: 18, width: '100%' }, // Ensure inputs take full width
    textInput: { backgroundColor: theme.colors.surfaceVariant },
    forgotPasswordLink: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'left', // Keep this left aligned or change to center if needed
      paddingVertical: 8,
      width: '100%', // Ensure it aligns with inputs if centered
    },
    bottomContent: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      paddingBottom: Platform.OS === 'ios' ? 30 : 24,
      borderTopWidth: Platform.OS === 'android' ? 1 : 0,
      borderTopColor: theme.colors.surfaceVariant,
      backgroundColor: theme.colors.background,
    },
    loginButton: {
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.colors.primary,
    },
    loginButtonLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.appTextSecondary || theme.colors.onPrimary,
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
    const loginData = {
      email,
      password,
    };
    console.log('Login User:', loginData);
  };

  const appbarHeight = 56;
  const keyboardVerticalOffsetValue = Platform.OS === 'ios' ? appbarHeight : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Appbar.Header style={styles.appbarHeader} mode="center-aligned" dense={true} statusBarHeight={0}>
        <Appbar.Action
          icon={() => <ArrowLeftIcon color={theme.colors.onBackground || '#000000'} size={24} />}
          onPress={() => router.back()}
          rippleColor="transparent"
        />
        <Appbar.Content title="Log In" color={theme.colors.onBackground} titleStyle={styles.appbarContentTitle}/>
        <View style={{ width: 48 }} />
      </Appbar.Header>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffsetValue}
      >
        <View style={styles.innerContainer}>
            <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainerScrollView}
            keyboardShouldPersistTaps="handled"
            >
            <Image source={{ uri: IMAGE_URL }} style={styles.inlineImage} />
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
            <TouchableOpacity onPress={() => console.log('Forgot Password pressed')} style={{width: '100%'}}>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}