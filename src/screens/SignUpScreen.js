import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Keyboard } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';

export default function SignUpScreen({ navigation }) {
    const { isLoaded, signUp, setActive } = useSignUp();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    // Start the sign up process.
    const onSignUpPress = async () => {
        if (!isLoaded) return;
        setLoading(true);
        Keyboard.dismiss();

        try {
            // Create the user on Clerk
            await signUp.create({
                firstName,
                lastName,
                emailAddress,
                password,
            });

            // Send verification Email
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

            // Change the UI to our pending section.
            setPendingVerification(true);
        } catch (err) {
            Alert.alert('Sign Up Error', err.errors[0].longMessage);
        } finally {
            setLoading(false);
        }
    };

    // This verifies the user on pressing the verify button
    const onPressVerify = async () => {
        if (!isLoaded) return;
        setLoading(true);
        Keyboard.dismiss();

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            await setActive({ session: completeSignUp.createdSessionId });
        } catch (err) {
            Alert.alert('Verification Error', err.errors[0].longMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Conditional rendering based on whether we are pending verification */}
            {!pendingVerification ? (
                <>
                    <Image source={require('../../assets/LogoDesign.png')} style={styles.logo} />
                    <Text style={styles.title}>Create an Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>

                    <View style={styles.nameContainer}>
                        <TextInput
                            style={styles.nameInput}
                            placeholder="First Name"
                            placeholderTextColor="#666"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <TextInput
                            style={styles.nameInput}
                            placeholder="Last Name"
                            placeholderTextColor="#666"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>

                    <TextInput
                        autoCapitalize="none"
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#666"
                        value={emailAddress}
                        onChangeText={setEmailAddress}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#666"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.loginButton} onPress={onSignUpPress} disabled={loading}>
                        <Text style={styles.loginButtonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text style={styles.signupText}>
                            Already have an account?{' '}
                            <Text style={styles.signupHighlight}>Login</Text>
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.title}>Verify Your Email</Text>
                    <Text style={styles.subtitle}>A verification code was sent to your email address.</Text>
                    <TextInput
                        value={code}
                        placeholder="Verification Code..."
                        placeholderTextColor="#666"
                        style={styles.input}
                        onChangeText={setCode}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.loginButton} onPress={onPressVerify} disabled={loading}>
                        <Text style={styles.loginButtonText}>{loading ? 'Verifying...' : 'Verify Email'}</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
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
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  nameInput: {
    width: '48%',
    padding: 12,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000000', // Explicit black color for typed text
    fontWeight: '500', // Added font weight for better visibility
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
    color: '#000000', // Explicit black color for typed text
    fontWeight: '500', // Added font weight for better visibility
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
