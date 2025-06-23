import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Appbar,
  Button,
  Text,
  TextInput,
  useTheme
} from 'react-native-paper';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { ArrowLeftIcon } from '../components/Icons';

const IMAGE_URL =
  'https://img.freepik.com/free-vector/home-renomation-flat-composition-with-plumber-fixing-pipes-vector-illustration_1284-80776.jpg';

interface CustomThemeColors {
  secondaryText: string;
  appTextPrimary?: string;
  appTextSecondary?: string;
  surfaceVariant?: string;
  onBackground?: string;
  background?: string;
  disabledButton?: string;
}

type ExtendedTheme = ReturnType<typeof useTheme> & {
  colors: CustomThemeColors & ReturnType<typeof useTheme>['colors'];
};

export default function LoginScreen() {
  const theme = useTheme() as ExtendedTheme;
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const screenWidth = Dimensions.get('window').width;

  const background = theme.colors.background;
  const onBackground = theme.colors.onBackground || theme.colors.onSurface;
  const surfaceVariant = theme.colors.surfaceVariant || theme.colors.surface;
  const inputBg = surfaceVariant;
  const disabledColor = theme.colors.disabledButton || '#888888';
  const buttonTextColor = theme.colors.appTextSecondary || theme.colors.onPrimary;

  const isFormValid = email.length > 0 && password.length > 0;

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: background,
      paddingTop: insets.top
    },
    appbarHeader: { backgroundColor: background, elevation: 0 },
    appbarTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: onBackground
    },
    inlineImage: {
      width: screenWidth,
      height: 200,
      resizeMode: 'cover',
      marginTop: -24,
      marginLeft: -24,
      marginBottom: 24
    },
    innerContainer: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 20,
      flexGrow: 1
    },
    headline: {
      color: onBackground,
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16
    },
    inputContainer: { marginBottom: 18, width: '100%' },
    textInput: { backgroundColor: inputBg },
    forgotPasswordLink: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: 'bold',
      paddingVertical: 8
    },
    bottomContent: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      paddingBottom: Platform.OS === 'ios' ? 30 : 24,
      borderTopWidth: Platform.OS === 'android' ? 1 : 0,
      borderTopColor: surfaceVariant,
      backgroundColor: background
    },
    loginButton: {
      height: 52,
      borderRadius: 26,
      backgroundColor: isFormValid
        ? theme.colors.primary
        : disabledColor
    },
    loginLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: buttonTextColor
    }
  });

  const inputTheme = {
    colors: {
      primary: theme.colors.primary,
      outline: surfaceVariant,
      onSurface: theme.colors.appTextPrimary || theme.colors.onSurface,
      onSurfaceVariant:
        theme.colors.appTextSecondary || theme.colors.onSurfaceVariant
    }
  };

  const commonInput = {
    mode: 'outlined' as const,
    style: styles.textInput,
    outlineStyle: { borderRadius: 12 },
    textColor: theme.colors.appTextPrimary || theme.colors.onSurface,
    theme: inputTheme
  };

  const handleLogin = async () => {
    if (!isFormValid) return;

    try {
      const response = await fetch('http://192.168.1.77:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Login failed');
      }

      const result = await response.json();
      console.log('Login successful:', result);
      if (result.token) {
        // Save the token as needed (e.g., AsyncStorage)
        // Navigate to the next screen, e.g., Home screen
        router.push('/(tabs)/index');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      // Handle error (show feedback to user)
      Alert.alert('Login Failed', 'Wrong credentials, please try again.');
    }
  };

  const appbarHeight = 56;
  const keyboardOffset = Platform.OS === 'ios' ? appbarHeight : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Appbar.Header
        style={styles.appbarHeader}
        mode="center-aligned"
        dense
        statusBarHeight={0}
      >
        <Appbar.Action
          icon={() => (
            <ArrowLeftIcon color={onBackground} size={24} />
          )}
          onPress={() => router.back()}
          rippleColor="transparent"
        />
        <Appbar.Content
          title="Log In"
          color={onBackground}
          titleStyle={styles.appbarTitle}
        />
        <View style={{ width: 48 }} />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
      >
        <View style={styles.innerContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={{ uri: IMAGE_URL }}
              style={styles.inlineImage}
            />
            <Text style={styles.headline}>Welcome back</Text>
            <View style={styles.inputContainer}>
              <TextInput
                label="Email or phone"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                {...commonInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                {...commonInput}
              />
            </View>
            <View>
              <TouchableOpacity
                onPress={() => console.log('Forgot Password pressed')}
              >
                <Text style={styles.forgotPasswordLink}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={styles.bottomContent}>
            <Button
              onPress={handleLogin}
              disabled={!isFormValid}
              style={styles.loginButton}
              labelStyle={styles.loginLabel}
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