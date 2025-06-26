import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, Easing, Alert } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import LeftSideMenu from './LeftSideMenu'; // Your existing LeftSideMenu component

// --- Step 3.1: Import the BarcodeDisplay component ---
// Make sure the path matches your project structure.
import BarcodeDisplay from '../components/common/BarcodeDisplay';

// We'll leave StickFigureAnimation commented out as in your original code.
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

  // Typing animation effect
  useEffect(() => {
    if (slideInCompleted) {
      const delayBeforeTyping = 100;

      if (currentIndex === 0) {
        const delayTimeout = setTimeout(() => {
          setCurrentIndex(1);
        }, delayBeforeTyping);

        return () => clearTimeout(delayTimeout);
      }

      const fullText = `WWelcome back, ${firstName}!`;
      if (currentIndex < fullText.length) {
        const typingTimeout = setTimeout(() => {
          setDisplayedText((prev) => prev + fullText[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, 65);

        return () => clearTimeout(typingTimeout);
      }
    }
  }, [currentIndex, firstName, slideInCompleted]);


  // Slide-in animation for feature boxes
  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(box1Anim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(box2Anim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(box3Anim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(box4Anim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSlideInCompleted(true);
    });
  }, []);

  // Handle Membership Button Click
  const handleMembershipClick = async () => {
    Alert.alert("Membership", "This would open the payment screen.");
  };

  // Menu animation functions
  const openMenu = () => {
    setIconColor('white');
    setIsMenuOpen(true); // Set state immediately

    Animated.parallel([
      Animated.timing(menuSlideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(menuOpacityAnim, {
        toValue: 0.95,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(iconSlideAnim, {
        toValue: screenWidth * 0.7 - 70, // Precise end position
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMenu = () => {
    setIconColor('black');

    Animated.parallel([
      Animated.timing(menuSlideAnim, {
        toValue: -screenWidth,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(menuOpacityAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(iconSlideAnim, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsMenuOpen(false); // Set state after animation
    });
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const toggleBarcodeMenu = () => {
    if (isBarcodeMenuOpen) {
      Animated.timing(barcodeMenuAnim, {
        toValue: screenHeight,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setIsBarcodeMenuOpen(false));
    } else {
      setIsBarcodeMenuOpen(true);
      Animated.timing(barcodeMenuAnim, {
        toValue: screenHeight * 0.1, // Slide up to 10% from the top
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };


  const handleLogout = () => {
    signOut(); // Use Clerk's signOut function
  };

  return (
    <View style={styles.container}>
      <LeftSideMenu
        menuSlideAnim={menuSlideAnim}
        menuOpacityAnim={menuOpacityAnim}
        handleLogout={handleLogout}
        isMenuOpen={isMenuOpen}
      />

      {/* Barcode Menu */}
      <Animated.View
        style={[
          styles.barcodeMenu,
          {
            transform: [{ translateY: barcodeMenuAnim }],
          },
        ]}
      >
        <View style={styles.barcodeMenuContent}>
          <Text style={styles.barcodeMenuTitle}>Your Membership Barcode</Text>

          {/* --- Step 3.2: Integrate the BarcodeDisplay Component --- */}
          {/* We check if the user object exists before trying to access its id. */}
          {/* Then, we pass the user's unique ID to the BarcodeDisplay component. */}
          {user ? (
            <BarcodeDisplay value={user.id} />
          ) : (
            <Text>Loading Barcode...</Text>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={toggleBarcodeMenu}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuIconContainer}
            onPress={toggleMenu}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Animated.Image
              source={require('../../assets/threelinesmenu.png')}
              style={[
                styles.menuIcon,
                { tintColor: iconColor },
                { transform: [{ translateX: iconSlideAnim }] },
              ]}
            />
          </TouchableOpacity>
          <Text style={[styles.headerText, { zIndex: 2 }]}>Eastside Gym</Text>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/LogoDesign.png')} style={styles.logo} />
          </View>
        </View>

        {/* Content Below Header */}
        <View style={styles.contentBelowHeader}>
          <Text style={styles.welcomeText}>{displayedText}</Text>

          {/* <StickFigureAnimation slideInCompleted={slideInCompleted} /> */}
          <View style={styles.featuresGrid}>
            {/* Top Row */}
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

            {/* Bottom Row */}
            <View style={styles.featureRow}>
              <Animated.View style={{ transform: [{ translateX: box3Anim }] }}>
                <TouchableOpacity style={styles.featureBox}>
                  <View style={styles.featureBoxTop}>
                    <Image source={require('../../assets/chart.png')} style={styles.featureIcon} />
                  </View>
                  <View style={styles.featureBoxBottom}>
                    <Text style={styles.featureText}>My Progress</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{ transform: [{ translateX: box4Anim }] }}>
                <TouchableOpacity style={styles.featureBox}>
                  <View style={styles.featureBoxTop}>
                    <Image source={require('../../assets/nutrition.png')} style={styles.featureIcon} />
                  </View>
                  <View style={styles.featureBoxBottom}>
                    <Text style={styles.featureText}>Nutrition</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom buttons */}
      <View style={bottomContainerStyle.container}>
        <TouchableOpacity style={[bottomContainerStyle.button, bottomContainerStyle.leftButton]}>
          <Image source={require('../../assets/dumbell.png')} style={bottomContainerStyle.buttonIcon} />
          <Text style={bottomContainerStyle.buttonText}>Workout Plans</Text>
        </TouchableOpacity>
        <TouchableOpacity style={bottomContainerStyle.button}>
          <Image source={require('../../assets/calendar.png')} style={bottomContainerStyle.buttonIcon} />
          <Text style={bottomContainerStyle.buttonText}>Book a Class</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[bottomContainerStyle.button, bottomContainerStyle.rightButton]}>
          <Image source={require('../../assets/nutrition.png')} style={bottomContainerStyle.buttonIcon} />
          <Text style={bottomContainerStyle.buttonText}>Nutrition</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Bottom Buttons Styles
const bottomContainerStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    height: 100,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  button: {
    width: screenWidth * 0.305,
    height: 120,
    backgroundColor: '#DCB335',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 6,
  },
  leftButton: {
    borderBottomLeftRadius: 34,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  rightButton: {
    borderBottomRightRadius: 34,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  buttonIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
    textAlign: 'center',
  },
});

// Main Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DCB335' },
  mainContent: { flex: 1, paddingHorizontal: 0, paddingTop: 63 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30, position: 'relative' },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#000', textAlign: 'center' },
  menuIconContainer: { position: 'absolute', left: 10, zIndex: 3 },
  menuIcon: { width: 54, height: 54, resizeMode: 'contain' },
  logoContainer: { position: 'absolute', right: 0 },
  logo: { width: 80, height: 80 },
  contentBelowHeader: { flex: 1, backgroundColor: '#000', paddingTop: 80 },
  welcomeText: { fontSize: 22, fontWeight: '600', color: '#DCB335', textAlign: 'center', marginBottom: 90 },
  barcodeMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.8,
    backgroundColor: '#DCB335',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
    padding: 20,
    zIndex: 2,
  },
  barcodeMenuContent: {
    alignItems: 'center',
    justifyContent: 'flex-start', // Changed to flex-start
    flex: 1,
    marginTop: 20,
  },
  barcodeMenuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute', // Position the close button for better UI
    bottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DCB335',
  },
  featuresGrid: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureBox: {
    width: (screenWidth - 60) / 2,
    backgroundColor: '#DCB335',
    borderRadius: 10,
    overflow: 'hidden',
    height: 150,
    borderWidth: 2,
    borderColor: '#DCB335',
  },
  featureBoxTop: {
    height: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCB335',
  },
  featureBoxBottom: {
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  featureIcon: { width: 50, height: 50, marginBottom: 10 },
  featureText: { fontSize: 16, fontWeight: 'bold', color: '#DCB335', textAlign: 'center' },
});