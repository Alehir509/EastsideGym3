import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';

export default function ForgotPasswordScreen({ navigation }) {
    const { signIn, isLoaded } = useSignIn();
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [loading, setLoading] = useState(false);

    // This function requests a password reset code to be sent to the user's email
    const onRequestReset = async () => {
        if (!isLoaded) return;
        setLoading(true);
        Keyboard.dismiss();
        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: emailAddress,
            });
            setSuccessfulCreation(true); // Switch to the "enter code" UI
        } catch (err) {
            Alert.alert('Error', err.errors[0].longMessage);
        } finally {
            setLoading(false);
        }
    };

    // This function attempts to reset the password using the code and new password
    const onReset = async () => {
        if (!isLoaded) return;
        setLoading(true);
        Keyboard.dismiss();
        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            });
            Alert.alert('Success', 'Password has been reset successfully.');
            navigation.navigate('SignIn'); // Navigate back to SignIn on success
        } catch (err) {
            Alert.alert('Error', err.errors[0].longMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password?</Text>

            {/* Show different UI based on whether the reset code has been sent */}
            {!successfulCreation ? (
                <>
                    <Text style={styles.subtitle}>Enter your email to receive a reset code.</Text>
                    <TextInput
                        autoCapitalize="none"
                        placeholder="Email"
                        value={emailAddress}
                        onChangeText={setEmailAddress}
                        style={styles.input}
                        keyboardType="email-address"
                    />
                    <TouchableOpacity style={styles.loginButton} onPress={onRequestReset} disabled={loading}>
                        <Text style={styles.loginButtonText}>{loading ? "Sending..." : "Send Reset Code"}</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.subtitle}>Check your email for the reset code.</Text>
                    <TextInput
                        placeholder="Reset Code"
                        value={code}
                        onChangeText={setCode}
                        style={styles.input}
                        keyboardType="numeric"
                    />
                    <TextInput
                        placeholder="New Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.loginButton} onPress={onReset} disabled={loading}>
                        <Text style={styles.loginButtonText}>{loading ? "Resetting..." : "Set New Password"}</Text>
                    </TouchableOpacity>
                </>
            )}

             <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.signupText}>
                    Back to{' '}
                    <Text style={styles.signupHighlight}>Sign In</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}