import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { customerAPI } from '../services/api';
import { validateAccountNumber, validateMobile } from '../utils/validation';

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const { login, setLoading, loading } = useAuth();
  const [accountNumber, setAccountNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const accountError = validateAccountNumber(accountNumber);
    const mobileError = validateMobile(mobile);

    if (accountError) newErrors.accountNumber = accountError;
    if (mobileError) newErrors.mobile = mobileError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const response = await customerAPI.login(accountNumber.trim(), mobile.trim());

      if (response.success) {
        login(response.data);
        navigation.replace('Payment');
      } else {
        Alert.alert('Login Failed', response.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'Failed to login. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            Payment Collection
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Login to continue
          </Text>

          <View style={styles.form}>
            <Input
              label="Account Number"
              value={accountNumber}
              onChangeText={(text) => {
                setAccountNumber(text);
                if (errors.accountNumber) {
                  setErrors({ ...errors, accountNumber: null });
                }
              }}
              placeholder="Enter account number"
              error={errors.accountNumber}
              autoCapitalize="none"
            />

            <Input
              label="Mobile Number"
              value={mobile}
              onChangeText={(text) => {
                setMobile(text);
                if (errors.mobile) {
                  setErrors({ ...errors, mobile: null });
                }
              }}
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
              error={errors.mobile}
              maxLength={10}
            />

            <Button
              title="Login"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: 8,
  },
});

export default LoginScreen;

