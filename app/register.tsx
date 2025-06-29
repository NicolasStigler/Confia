import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from '../components/Icons';

interface AppCustomNamedColors {
  appTextSecondary?: string;
  clientPageBg?: string;
  clientInputBg?: string;
  clientPlaceholder?: string;
  clientButtonBg?: string;
  clientButtonText?: string;
  surfaceVariant?: string;
  onBackground?: string;
  disabledButton?: string;
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

  const background = theme.colors.clientPageBg || (theme.dark ? '#111c22' : '#FFFFFF');
  const inputBackground = theme.colors.clientInputBg || (theme.dark ? '#243b47' : '#F0F0F0');
  const placeholderText = theme.colors.clientPlaceholder || (theme.dark ? '#93b6c8' : '#757575');
  const textPrimary = theme.colors.onBackground || '#000000';
  const textSecondary = theme.colors.appTextSecondary || theme.colors.onSurfaceVariant;
  const disabledButtonColor = theme.colors.disabledButton || '#888888';

  const isFormValid =
    firstname &&
    lastname &&
    age &&
    email &&
    password &&
    address;

  const handleAge = (t: string) => {
    const digits = t.replace(/\D/g, '').slice(0, 3);
    setAge(digits);
  };

  const handleRegister = async () => {
    if (!isFormValid) return;
    const data: any = {
      firstname,
      lastname,
      age: parseInt(age, 10),
      email,
      password,
      isWorker: isWorker.toString(),
    };

    if (!isWorker) {
      data.direccion = address;
    }

    try {
      const role = await fetchRegister(data);
      if (role) {
        router.push('(client)');
      } else {
        alert('Registration failed: no token received');
      }
    } catch (error: any) {
      console.error('Registration error:', error?.message || error);
      alert('Registration failed: ' + (error?.message || 'unknown error'));
    }
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: background },
    appbarHeader: { backgroundColor: background, elevation: 0 },
    appbarTitle: { fontSize: 18, fontWeight: 'bold', color: textPrimary },
    scrollView: { flex: 1 },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 20,
      flexGrow: 1
    },
    welcomeTitle: {
      color: textPrimary,
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8
    },
    welcomeSubtitle: {
      color: textPrimary,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 24
    },
    nameRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 18
    },
    nameInput: { width: '37%' },
    ageInput: { width: '18%' },
    inputContainer: { marginBottom: 18, width: '100%' },
    textInput: { backgroundColor: inputBackground },
    bottomContainer: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      paddingBottom: Platform.OS === 'ios' ? 30 : 24,
      borderTopWidth: Platform.OS === 'android' ? 1 : 0,
      borderTopColor: theme.colors.surfaceVariant,
      backgroundColor: background
    },
    registerButton: {
      height: 52,
      borderRadius: 26,
      backgroundColor: isFormValid ? theme.colors.primary : disabledButtonColor
    },
    registerLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.appTextSecondary || theme.colors.onPrimary
    },
    loginRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24
    },
    loginPrompt: { color: placeholderText, fontSize: 14 },
    loginLink: {
      color: placeholderText,
      fontSize: 14,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      marginLeft: 4
    }
  });

  const inputTheme = {
    colors: {
      primary: theme.colors.primary,
      outline: inputBackground,
      onSurface: textPrimary,
      onSurfaceVariant: placeholderText
    }
  };

  const commonInputProps = {
    mode: 'outlined' as const,
    style: styles.textInput,
    outlineStyle: { borderRadius: 12 },
    textColor: textPrimary,
    theme: inputTheme
  };

  const appbarHeight = 56;
  const keyboardOffset = Platform.OS === 'ios' ? appbarHeight : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Appbar.Header style={styles.appbarHeader} mode="center-aligned" dense statusBarHeight={0}>
        <Appbar.Action
          icon={() => <ArrowLeftIcon color={textPrimary} size={24} />}
          onPress={() => router.back()}
          rippleColor="transparent"
        />
        <Appbar.Content
          title="Create Account"
          color={textPrimary}
          titleStyle={styles.appbarTitle}
        />
        <View style={{ width: 48 }} />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.welcomeTitle}>Welcome to Confia</Text>
          <Text style={styles.welcomeSubtitle}>
            {isWorker
              ? 'Join our network of trusted professionals.'
              : 'Find trusted professionals for your home service needs.'}
          </Text>

          <View style={styles.nameRow}>
            <View style={styles.nameInput}>
              <TextInput
                label="First Name"
                value={firstname}
                onChangeText={setFirstname}
                {...commonInputProps}
              />
            </View>
            <View style={styles.nameInput}>
              <TextInput
                label="Last Name"
                value={lastname}
                onChangeText={setLastname}
                {...commonInputProps}
              />
            </View>
            <View style={styles.ageInput}>
              <TextInput
                label="Age"
                value={age}
                onChangeText={handleAge}
                keyboardType="numeric"
                maxLength={3}
                {...commonInputProps}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              label="Email"
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

          <View style={styles.inputContainer}>
            <TextInput
              label="Address"
              value={address}
              onChangeText={setAddress}
              autoCapitalize="words"
              {...commonInputProps}
            />
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Button
            onPress={handleRegister}
            disabled={!isFormValid}
            style={styles.registerButton}
            labelStyle={styles.registerLabel}
            contentStyle={{ height: '100%' }}
          >
            Register
          </Button>

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}