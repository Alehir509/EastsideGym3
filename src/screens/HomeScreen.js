import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, Easing, Alert } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';

// Since we don't have these custom components, I've commented them out
// so the code is runnable. You can uncomment them in your project.
// import BarcodeDisplay from './BarcodeDisplay';
// import StickFigureAnimation from './StickFigureAnimation';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function HomeScreen() {
  // === CLERK INTEGRATION START ===
  const { user } = useUser(); // Hook to get the full user object
  const { signOut } = useAuth(); // Hook to get the signOut function

  // Get the first name directly from the user object. Fallback to 'User'.
  const firstName = user ? user.firstName : 'User';
  // === CLERK INTEGRATION END ===

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBarcodeMenuOpen, setIsBarcodeMenuOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideInCompleted, setSlideInCompleted] = useState(false);

  // Animated Values
  const menuSlideAnim = useRef(new Animated.Value(-screenWidth)).current;
  const menuOpacityAnim = useRef(new Animated.Value(0)).current;
  const iconSlideAnim = useRef(new Animated.Value(0)).current;
  const barcodeMenuAnim = useRef(new Animated.Value(screenHeight)).current;
  const [iconColor, setIconColor] = useState('black');
  const box1Anim = useRef(new Animated.Value(-screenWidth)).current;
  const box2Anim = useRef(new Animated.Value(screenWidth)).current;
  const box3Anim = useRef(new Animated.Value(-screenWidth)).current;
  const box4Anim = useRef(new Animated.Value(screenWidth)).current;

  // Typing animation effect (updated to use the firstName from Clerk)
  useEffect(() => {
    if (slideInCompleted && user) {
      const fullText = `Welcome back, ${firstName}!`;
      if (currentIndex < fullText.length) {
        const typingTimeout = setTimeout(() => {
          setDisplayedText((prev) => prev + fullText[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, 65);
        return () => clearTimeout(typingTimeout);
      }
    }
  }, [currentIndex, user, slideInCompleted]); // Depend on `user` object

  // Slide-in animation for feature boxes
  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(box1Anim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(box2Anim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(box3Anim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(box4Anim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => setSlideInCompleted(true));
  }, []);

  // Handle Membership Button Click
  const handleMembershipClick = async () => {
    // This is where you would call your backend to create a Stripe payment intent.
    // IMPORTANT: When calling your backend, you should now include the user's ID
    // so you can link the payment to their account.
    // Example: body: JSON.stringify({ clerkId: user.id, amount: 1000 })
    Alert.alert("Membership", "This would open the payment screen.");
  };

  const openMenu = () => { /* ...your animation code... */ };
  const closeMenu = () => { /* ...your animation code... */ };
  const toggleMenu = () => { /* ...your animation code... */ };
  const toggleBarcodeMenu = () => { /* ...your animation code... */ };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.menu, { transform: [{ translateX: menuSlideAnim }], opacity: menuOpacityAnim }]}>
        <View style={styles.menuContent}>
          <Text style={styles.menuTitle}>Menu</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
          {/* === CLERK INTEGRATION: Use signOut() for logout === */}
          <TouchableOpacity style={styles.menuItem} onPress={signOut}>
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View style={[styles.barcodeMenu, { transform: [{ translateY: barcodeMenuAnim }] }]}>
        <View style={styles.barcodeMenuContent}>
          <Text style={styles.barcodeMenuTitle}>Your Membership Barcode</Text>
          {/* === CLERK INTEGRATION: Use user.id for the barcode value === */}
          {user ? (
            // <BarcodeDisplay value={user.id} />
            <Text>Barcode for {user.id}</Text> // Placeholder
          ) : (
            <Text>Loading Barcode...</Text>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={toggleBarcodeMenu}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.mainContent}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.menuIconContainer} onPress={toggleMenu}>
                <Image source={require('../../assets/threelinesmenu.png')} style={styles.menuIcon} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Eastside Gym</Text>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/LogoDesign.png')} style={styles.logo} />
            </View>
        </View>

        <View style={styles.contentBelowHeader}>
          <Text style={styles.welcomeText}>{displayedText}</Text>

          {/* <StickFigureAnimation slideInCompleted={slideInCompleted} /> */}

          <View style={styles.featuresGrid}>
             <View style={styles.featureRow}>
                <Animated.View style={{ transform: [{ translateX: box1Anim }] }}>
                    <TouchableOpacity style={styles.featureBox} onPress={handleMembershipClick}>
                        <View style={styles.featureBoxTop}>
                            <Image source={require('../../assets/membership.png')} style={styles.featureIcon} />
                        </View>
                        <View style={styles.featureBoxBottom}>
                            <Text style={styles.featureText}>Membership</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ transform: [{ translateX: box2Anim }] }}>
                    <TouchableOpacity style={styles.featureBox} onPress={toggleBarcodeMenu}>
                        <View style={styles.featureBoxTop}>
                            <Image source={require('../../assets/bar_code.png')} style={styles.featureIcon} />
                        </View>
                        <View style={styles.featureBoxBottom}>
                            <Text style={styles.featureText}>Barcode</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </View>
            {/* ... other feature boxes ... */}
          </View>
        </View>
      </View>
      {/* ... bottom buttons ... */}
    </View>
  );
}

// ... your existing styles ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DCB335' },
  menu: { position: 'absolute', top: 0, left: 0, width: screenWidth * 0.7, height: '100%', backgroundColor: '#000', zIndex: 10,},
  menuContent: { paddingTop: 70, paddingHorizontal: 16 },
  menuTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 20 },
  menuItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#333' },
  menuItemText: { fontSize: 18, color: '#FFFFFF' },
  mainContent: { flex: 1, paddingTop: 63,},
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30, position: 'relative', paddingHorizontal: 16,},
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#000', textAlign: 'center', flex: 1,},
  menuIconContainer: { position: 'absolute', left: 16, zIndex: 1,},
  menuIcon: { width: 54, height: 54, resizeMode: 'contain' },
  logoContainer: { position: 'absolute', right: 16 },
  logo: { width: 80, height: 80, resizeMode: 'contain'},
  contentBelowHeader: { flex: 1, backgroundColor: '#000', paddingTop: 80, borderTopLeftRadius: 30, borderTopRightRadius: 30},
  welcomeText: { fontSize: 22, fontWeight: '600', color: '#DCB335', textAlign: 'center', marginBottom: 90 },
  barcodeMenu: { position: 'absolute', bottom: 0, left: 0, right: 0, height: screenHeight * 0.8, backgroundColor: '#DCB335', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 2, borderColor: '#000', padding: 20, zIndex: 20, transform: [{translateY: screenHeight}]},
  barcodeMenuContent: { alignItems: 'center', flex: 1, marginTop: 20,},
  barcodeMenuTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 20 },
  closeButton: { marginTop: 20, padding: 10, backgroundColor: '#000', borderRadius: 5 },
  closeButtonText: { fontSize: 16, fontWeight: 'bold', color: '#DCB335' },
  featuresGrid: { flex: 1, justifyContent: 'flex-start', paddingHorizontal: 20,},
  featureRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  featureBox: { width: (screenWidth - 60) / 2, backgroundColor: '#DCB335', borderRadius: 10, overflow: 'hidden', height: 150, borderWidth: 2, borderColor: '#DCB335',},
  featureBoxTop: { height: '55%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#DCB335',},
  featureBoxBottom: { height: '45%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000',},
  featureIcon: { width: 50, height: 50, resizeMode: 'contain',},
  featureText: { fontSize: 16, fontWeight: 'bold', color: '#DCB335', textAlign: 'center' },
});