import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Keyboard, Animated } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';

export default function SignInScreen({ navigation }) {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Keyboard Handling Logic ---
  // We'll use an Animated.Value for a smoother adjustment.
  const viewPadding = new Animated.Value(0);

  useEffect(() => {
    // This effect adds listeners for when the keyboard is shown or hidden.
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        // Animate the view's paddingBottom to the height of the keyboard.
        Animated.timing(viewPadding, {
          toValue: e.endCoordinates.height / 2, // Adjusting by half the keyboard height often feels best
          duration: 250,
          useNativeDriver: false, // paddingBottom is not supported by native driver
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // Animate the padding back to 0.
        Animated.timing(viewPadding, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    );

    // Cleanup the listeners when the component unmounts.
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  // --- End of Keyboard Handling Logic ---

  const onSignInPress = async () => {
    if (!isLoaded) return;
    Keyboard.dismiss();
    setLoading(true);

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err) {
      const firstError = err.errors[0];
      Alert.alert('Sign In Error', firstError.longMessage || firstError.message);
      setLoading(false);
    }
  };

  return (
    // We wrap the content in an Animated.View to apply the animated padding.
    <Animated.View style={[styles.container, { paddingBottom: viewPadding }]}>
      <Image source={require('../../assets/LogoDesign.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Login to your account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#333"
        value={emailAddress}
        onChangeText={setEmailAddress}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#333"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={onSignInPress}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>{loading ? 'Signing In...' : 'Login'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <Text style={styles.signupHighlight}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#DCB335',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#000',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupText: {
    color: '#000',
    marginTop: 10,
    fontSize: 15,
  },
  signupHighlight: {
    fontWeight: 'bold',
  },
});
