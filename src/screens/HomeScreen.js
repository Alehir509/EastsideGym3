// C:/Users/alexh/OneDrive/Documents/EastsideGym3/src/screens/HomeScreen.js

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Svg, { Circle } from 'react-native-svg';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-expo'; // Import useAuth for the logout function

import MetricCardWidget from '../components/common/MetricCard';
import BarcodeDisplay from '../components/common/BarcodeDisplay'; // Import BarcodeDisplay

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// --- Responsive Sizing & Theme (Self-contained) ---
const w = (percentage) => screenWidth * (percentage / 100);
const h = (percentage) => screenHeight * (percentage / 100);
const sp = (size) => size * (screenWidth / 375);
const FONT_REGULAR = Platform.select({ ios: 'System', default: 'sans-serif' });
const FONT_MEDIUM = Platform.select({ ios: 'System', default: 'sans-serif-medium' });
const FONT_BOLD = Platform.select({ ios: 'System', default: 'sans-serif-bold' });
const FONT_MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

const AppTheme = {
  accentYellow: '#DCB335',
  primaryBlack: '#000000',
  highlightWhite: '#FFFFFF',
  mediumGray: '#8E8E8E',
  charcoalBlack: '#1A1A1A',
  successGreen: '#00C851',
  errorRed: '#FF4444',
  cardColor: '#1C1C1E',
  scaffoldBackgroundColor: '#000000',
  textTheme: {
    headlineLarge: { fontFamily: FONT_BOLD, fontSize: sp(32), color: '#FFFFFF' },
    headlineSmall: { fontFamily: FONT_BOLD, fontSize: sp(24), color: '#8E8E8E' },
    titleMedium: { fontFamily: FONT_MEDIUM, fontSize: sp(16), fontWeight: '500', color: '#FFFFFF' },
    bodyMedium: { fontFamily: FONT_REGULAR, fontSize: sp(14), color: '#8E8E8E' },
    labelLarge: { fontFamily: FONT_MEDIUM, fontSize: sp(14), fontWeight: '600', color: '#FFFFFF' },
    labelSmall: { fontFamily: FONT_REGULAR, fontSize: sp(10), color: '#8E8E8E' },
    labelMedium: { fontFamily: FONT_MEDIUM, fontSize: sp(12), fontWeight: '600', color: '#DCB335' },
  },
};

// --- Main Dashboard Screen Component ---
export default function DashboardScreen({ navigation }) {
  // --- LOCAL WIDGET IMPLEMENTATIONS ---
  const TypingAnimation = ({ text, style }) => {
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
      setDisplayedText('');
      let i = 0;
      const intervalId = setInterval(() => {
        i++;
        setDisplayedText(text.substring(0, i));
        if (i >= text.length) clearInterval(intervalId);
      }, 50);
      return () => clearInterval(intervalId);
    }, [text]);
    return <Text style={style}>{displayedText}</Text>;
  };

  const CircularProgressWidget = ({ progress, size, strokeWidth = 8.0, backgroundColor = AppTheme.charcoalBlack, progressColor = AppTheme.accentYellow, children }) => {
    const animatedProgress = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.timing(animatedProgress, { toValue: progress, duration: 1500, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    }, [progress]);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = animatedProgress.interpolate({ inputRange: [0, 1], outputRange: [circumference, 0] });
    return (
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke={backgroundColor} strokeWidth={strokeWidth} fill="transparent" />
          <AnimatedCircle cx={size / 2} cy={size / 2} r={radius} stroke={progressColor} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" originX={size/2} originY={size/2} rotation={-90} fill="transparent" />
        </Svg>
        <View style={StyleSheet.absoluteFillObject}>{children}</View>
      </View>
    );
  };

  const AppBar = ({ onMenuPress, isMenuOpen }) => (
    <View style={styles.appBar}>
      <TouchableOpacity onPress={onMenuPress} style={styles.appBarButton}><Icon name={isMenuOpen ? "close" : "menu"} size={24} color={AppTheme.highlightWhite} /></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.appBarButton}><Icon name="person" size={24} color={AppTheme.highlightWhite} /></TouchableOpacity>
    </View>
  );

  const WelcomeSection = ({ userData }) => (
    <View style={styles.welcomeSection}>
      <TypingAnimation text='Welcome back,' style={AppTheme.textTheme.headlineSmall} />
      <SizedBox height={h(0.8)} /><Text style={AppTheme.textTheme.headlineLarge}>{userData.name}</Text>
      <SizedBox height={h(0.8)} /><View style={styles.membershipBadge}><Text style={AppTheme.textTheme.labelMedium}>{userData.membershipType} Member</Text></View>
    </View>
  );

  const WeeklyGoalSection = ({ userData }) => {
    const progressPercentage = userData.currentProgress / userData.weeklyGoal;
    return (
      <View style={styles.weeklyGoalCard}>
        <CircularProgressWidget progress={progressPercentage} size={w(20)} strokeWidth={8}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'white', fontSize: sp(24), fontWeight: 'bold'}}>{userData.currentProgress}</Text>
            <Text style={{color: AppTheme.mediumGray, fontSize: sp(10)}}>of {userData.weeklyGoal}</Text>
          </View>
        </CircularProgressWidget>
        <View style={styles.weeklyGoalTextContainer}>
          <Text style={AppTheme.textTheme.titleMedium}>Weekly Goal Progress</Text>
          <SizedBox height={h(1)} />
          <Text style={AppTheme.textTheme.bodyMedium}>{(progressPercentage * 100).toFixed(0)}% completed</Text>
          <SizedBox height={h(1)} />
          <Text style={{...AppTheme.textTheme.labelMedium, color: progressPercentage >= 1 ? AppTheme.successGreen : AppTheme.accentYellow}}>
            {progressPercentage >= 1 ? 'Goal achieved! 🎉' : `${userData.weeklyGoal - userData.currentProgress} workouts to go`}
          </Text>
        </View>
      </View>
    );
  };

  const SlideMenu = ({ isOpen, animation, onClose, quickActions, onLogout }) => {
    const menuTranslateX = animation.interpolate({ inputRange: [0, 1], outputRange: [-w(75), 0] });
    const overlayOpacity = animation.interpolate({ inputRange: [0, 1], outputRange: [0, 0.7] });

    const [isMenuRendered, setIsMenuRendered] = useState(false);
    useEffect(() => { if (isOpen) setIsMenuRendered(true); }, [isOpen]);
    const onAnimationComplete = ({ finished }) => { if (finished && !isOpen) setIsMenuRendered(false); };

    const MenuHeader = () => (
      <View style={styles.menuHeader}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.menuHeaderTitle}>Eastside Gym</Text>
          <TouchableOpacity onPress={onClose} style={styles.menuCloseButton}>
            <Icon name="close" size={20} color={AppTheme.highlightWhite} />
          </TouchableOpacity>
        </View>
        <SizedBox height={h(2)} />
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={[styles.menuCircle, { width: w(20), height: w(20), borderColor: 'rgba(220, 179, 53, 0.3)' }]}>
            <View style={[styles.menuCircle, { width: w(15), height: w(15), borderColor: 'rgba(220, 179, 53, 0.5)' }]}>
              <View style={[styles.menuCircle, { width: w(10), height: w(10), backgroundColor: AppTheme.accentYellow, borderWidth: 0 }]}>
                <Icon name="fitness-center" size={20} color={AppTheme.primaryBlack} />
              </View>
            </View>
          </View>
        </View>
      </View>
    );

    const MenuItem = ({ action, index }) => {
      const itemTranslate = animation.interpolate({
        inputRange: [0, 0.4 + index * 0.06, 0.6 + index * 0.06, 1],
        outputRange: [-w(50), -w(50), 0, 0],
        extrapolate: 'clamp',
      });
      const itemOpacity = animation.interpolate({
        inputRange: [0, 0.4 + index * 0.06, 0.6 + index * 0.06, 1],
        outputRange: [0, 0, 1, 1],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View style={{ opacity: itemOpacity, transform: [{ translateX: itemTranslate }] }}>
          <TouchableOpacity
            style={styles.menuListItem}
            onPress={() => {
              onClose();
              setTimeout(() => navigation.navigate(action.route), 250);
            }}
          >
            <View style={styles.menuListItemIcon}>
              <Icon name={action.icon} size={20} color={AppTheme.accentYellow} />
            </View>
            <SizedBox width={w(4)} />
            <Text style={styles.menuListItemText}>{action.title}</Text>
            <Icon name="arrow-forward-ios" size={16} color={AppTheme.mediumGray} />
          </TouchableOpacity>
        </Animated.View>
      );
    };

    const MenuFooter = () => (
      <View style={styles.menuFooter}>
        <View style={styles.menuDivider} />
        <SizedBox height={h(2)} />
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={onLogout}>
          <Icon name="logout" size={20} color={AppTheme.errorRed} />
          <SizedBox width={w(4)} />
          <Text style={styles.menuFooterLogoutText}>Logout</Text>
        </TouchableOpacity>
        <SizedBox height={h(2)} />
        <Text style={styles.menuFooterVersionText}>Version 1.0.0</Text>
      </View>
    );

    if (!isMenuRendered) return null;

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? 'auto' : 'none'}>
        <Animated.View style={[styles.menuOverlay, { opacity: overlayOpacity }]} onLayout={onAnimationComplete}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>
        <Animated.View style={[styles.slideMenu, { transform: [{ translateX: menuTranslateX }] }]}>
          <SafeAreaView style={{ flex: 1, backgroundColor: AppTheme.charcoalBlack }}>
            <MenuHeader />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: h(2) }}>
              {quickActions.map((action, index) => (
                <MenuItem key={action.title} action={action} index={index} />
              ))}
            </ScrollView>
            <MenuFooter />
          </SafeAreaView>
        </Animated.View>
      </View>
    );
  };

  const BottomNavigationBar = ({ currentTabIndex, onTabTapped }) => {
    const tabs = [{ label: 'Dashboard', icon: 'dashboard' }, { label: 'Workouts', icon: 'fitness-center' }, { label: 'Classes', icon: 'event' }, { label: 'Barcode', icon: 'qr-code-scanner' }];
    return (
      <View style={styles.bottomNav}>
        {tabs.map((tab, index) => (
          <TouchableOpacity key={tab.label} style={styles.bottomNavItem} onPress={() => onTabTapped(index)}>
            <Icon name={tab.icon} size={24} color={currentTabIndex === index ? AppTheme.accentYellow : AppTheme.mediumGray} />
            <Text style={[styles.bottomNavLabel, {color: currentTabIndex === index ? AppTheme.accentYellow : AppTheme.mediumGray}]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const SizedBox = ({ width, height }) => <View style={{ width, height }} />;

  // --- STATE, REFS, AND DATA ---
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);

  // Animation refs
  const slideAnim = useRef(new Animated.Value(h(100))).current;
  const fabAnim = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;

  // Barcode animation refs (restored to original implementation)
  const barcodeMenuAnim = useRef(new Animated.Value(screenHeight)).current;
  const decorElement1Anim = useRef(new Animated.Value(-200)).current;
  const decorElement2Anim = useRef(new Animated.Value(200)).current;
  const decorElement3Anim = useRef(new Animated.Value(-200)).current;
  const decorElement4Anim = useRef(new Animated.Value(200)).current;
  const barcodeScaleAnim = useRef(new Animated.Value(0)).current;

  const mockData = {
    user: { name: "Alex Johnson", weeklyGoal: 5, currentProgress: 3, membershipType: "Premium", profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
    metrics: [
      { id: 1, title: "Calories Burned", value: "1,247", subtitle: "Today", iconName: "local-fire-department", iconColor: AppTheme.errorRed, progress: 0.75, target: "1,500 cal goal" },
      { id: 2, title: "Workouts", value: "3", subtitle: "This Week", iconName: "fitness-center", iconColor: AppTheme.accentYellow, progress: 0.6, target: "5 workout goal" },
      { id: 3, title: "Achievement Streak", value: "12", subtitle: "Days", iconName: "emoji-events", iconColor: AppTheme.successGreen, progress: 0.8, target: "15 day milestone" },
      { id: 4, title: "Upcoming Classes", value: "2", subtitle: "This Week", iconName: "event", iconColor: AppTheme.mediumGray, progress: 1.0, target: "Yoga & HIIT booked" },
    ],
    quickActions: [
      { title: "Start Workout", icon: "play-arrow", route: "Workout" },
      { title: "Book Class", icon: "event-available", route: "Classes" },
      { title: "View Progress", icon: "trending-up", route: "Progress" },
      { title: "Nutrition", icon: "restaurant", route: "Nutrition" },
    ],
  };

  // --- EFFECTS & HANDLERS ---
  useEffect(() => {
    if (isLoaded) {
      Animated.stagger(600, [
        Animated.timing(slideAnim, { toValue: 0, duration: 800, easing: Easing.out(Easing.back(1)), useNativeDriver: true }),
        Animated.spring(fabAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    }
  }, [isLoaded]);

  const toggleMenu = () => {
    const toValue = isMenuOpen ? 0 : 1;
    setIsMenuOpen(!isMenuOpen);
    Animated.timing(menuAnim, {
      toValue,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = async () => {
    toggleMenu(); // Close the menu
    setTimeout(async () => {
      await signOut(); // Sign out after menu animation starts
    }, 250);
  };

  const refreshData = async () => { setIsRefreshing(true); await new Promise(resolve => setTimeout(resolve, 2000)); setIsRefreshing(false); };

  const toggleBarcodeModal = () => {
    if (isBarcodeModalOpen) {
      Animated.timing(barcodeMenuAnim, { toValue: screenHeight, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }).start(() => {
        setIsBarcodeModalOpen(false);
        // Reset values for next open
        decorElement1Anim.setValue(-200);
        decorElement2Anim.setValue(200);
        decorElement3Anim.setValue(-200);
        decorElement4Anim.setValue(200);
        barcodeScaleAnim.setValue(0);
      });
    } else {
      setIsBarcodeModalOpen(true);
      Animated.sequence([
        Animated.timing(barcodeMenuAnim, { toValue: 0, duration: 450, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.parallel([
          Animated.stagger(100, [
            Animated.timing(decorElement1Anim, { toValue: 0, duration: 600, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
            Animated.timing(decorElement2Anim, { toValue: 0, duration: 600, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
            Animated.timing(decorElement3Anim, { toValue: 0, duration: 600, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
            Animated.timing(decorElement4Anim, { toValue: 0, duration: 600, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
          ]),
          Animated.timing(barcodeScaleAnim, { toValue: 1, duration: 500, delay: 200, easing: Easing.out(Easing.back(1.1)), useNativeDriver: true }),
        ]),
      ]).start();
    }
  };

  const onTabTapped = (index) => {
    if (index === 3) {
      toggleBarcodeModal();
      return;
    }
    setCurrentTabIndex(index);
    const routes = ['Dashboard', 'Workouts', 'Classes'];
    if (index !== 0) navigation.navigate(routes[index]);
  };

  // --- RENDER LOGIC ---
  if (!isLoaded) { return (<View style={styles.loadingContainer}><ActivityIndicator size="large" color={AppTheme.accentYellow} /></View>); }

  const finalUserData = { ...mockData.user, name: isSignedIn ? clerkUser.firstName : "Guest", profileImage: isSignedIn ? clerkUser.profileImageUrl : mockData.user.profileImage };
  const { metrics, quickActions } = mockData;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1, backgroundColor: AppTheme.scaffoldBackgroundColor }}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshData} tintColor={AppTheme.accentYellow} />}
        >
          <AppBar onMenuPress={toggleMenu} isMenuOpen={isMenuOpen} />
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <WelcomeSection userData={finalUserData} />
            <WeeklyGoalSection userData={mockData.user} />
            {metrics.map((metric, index) => (
              <MetricCardWidget key={metric.id} {...metric} index={index} slideAnim={slideAnim} navigation={navigation}/>
            ))}
          </Animated.View>
          <View style={{ height: h(12) }} />
        </ScrollView>

        {isRefreshing && ( <View style={styles.refreshOverlay}><View style={styles.refreshIndicatorContainer}><ActivityIndicator size="large" color={AppTheme.accentYellow} /><Text style={styles.refreshText}>Syncing your data...</Text></View></View> )}
      </View>
      <BottomNavigationBar currentTabIndex={currentTabIndex} onTabTapped={onTabTapped} />
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabAnim }] }]}>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Workout')}>
          <Icon name="play-arrow" size={24} color={AppTheme.primaryBlack} />
          <Text style={styles.fabLabel}>Start Workout</Text>
        </TouchableOpacity>
      </Animated.View>
      <SlideMenu
        isOpen={isMenuOpen}
        animation={menuAnim}
        onClose={toggleMenu}
        quickActions={quickActions}
        onLogout={handleLogout}
      />

      {isBarcodeModalOpen && (
        <Animated.View style={[ styles.enhancedBarcodeMenu, { transform: [{ translateY: barcodeMenuAnim }] }]}>
            <Animated.View style={[ styles.decorElement, styles.decorElement1, { transform: [{ translateX: decorElement1Anim }] }]}/>
            <Animated.View style={[ styles.decorElement, styles.decorElement2, { transform: [{ translateX: decorElement2Anim }] }]}/>
            <Animated.View style={[ styles.decorElement, styles.decorElement3, { transform: [{ translateX: decorElement3Anim }] }]}/>
            <Animated.View style={[ styles.decorElement, styles.decorElement4, { transform: [{ translateX: decorElement4Anim }] }]}/>
            <View style={styles.concentricCircles}><View style={[styles.circle, styles.circle1]} /><View style={[styles.circle, styles.circle2]} /><View style={[styles.circle, styles.circle3]} /></View>
            <SafeAreaView style={styles.enhancedBarcodeContent}>
              <TouchableOpacity style={styles.enhancedCloseButton} onPress={toggleBarcodeModal}>
                <Text style={styles.enhancedCloseButtonText}>✕</Text>
              </TouchableOpacity>
              <Animated.View style={{ transform: [{ scale: barcodeScaleAnim }] }}>
                {clerkUser ? ( <BarcodeDisplay value={clerkUser.id} /> ) : ( <Text style={styles.loadingText}>Loading...</Text> )}
              </Animated.View>
              <Text style={styles.userName}>{finalUserData.name}</Text>
              <View style={[styles.membershipBadge, { alignSelf: 'center', marginTop: h(1) }]}>
                <Text style={AppTheme.textTheme.labelMedium}>Premium Member</Text>
              </View>
            </SafeAreaView>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: AppTheme.scaffoldBackgroundColor },
  safeArea: { flex: 1, backgroundColor: AppTheme.scaffoldBackgroundColor },
  scrollView: { paddingHorizontal: w(4), paddingTop: h(1) },
  appBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: h(1) },
  appBarButton: { padding: w(3), backgroundColor: AppTheme.cardColor, borderRadius: 12 },
  welcomeSection: { paddingVertical: h(2) },
  membershipBadge: { backgroundColor: 'rgba(220, 179, 53, 0.1)', paddingHorizontal: w(3), paddingVertical: h(0.5), borderRadius: 20, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(220, 179, 53, 0.2)' },
  weeklyGoalCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: AppTheme.cardColor, padding: w(4), borderRadius: 16, marginVertical: h(2) },
  weeklyGoalTextContainer: { flex: 1, marginLeft: w(4) },
  fabContainer: { position: 'absolute', bottom: h(9) + h(5), right: w(4), zIndex: 10 },
  fab: { flexDirection: 'row', alignItems: 'center', backgroundColor: AppTheme.accentYellow, paddingVertical: h(1.5), paddingHorizontal: w(5), borderRadius: 30, elevation: 4, shadowColor: AppTheme.accentYellow, shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 4 },
  fabLabel: { ...AppTheme.textTheme.labelLarge, color: AppTheme.primaryBlack, marginLeft: w(2) },
  bottomNav: { flexDirection: 'row', height: h(9), backgroundColor: AppTheme.scaffoldBackgroundColor, borderTopWidth: 1, borderTopColor: AppTheme.charcoalBlack },
  bottomNavItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottomNavLabel: { ...AppTheme.textTheme.labelSmall, marginTop: h(0.5), color: AppTheme.mediumGray },
  refreshOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  refreshIndicatorContainer: { backgroundColor: AppTheme.cardColor, padding: w(5), borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  refreshText: { ...AppTheme.textTheme.bodyMedium, color: AppTheme.highlightWhite, marginLeft: w(4) },

  // New Slide Menu Styles
  menuOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,1)', zIndex: 999 },
  slideMenu: { position: 'absolute', top: 0, bottom: 0, left: 0, width: w(75), zIndex: 1000,
    shadowColor: "#000", shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 20,
  },
  menuHeader: { padding: w(4), backgroundColor: 'rgba(220, 179, 53, 0.05)' },
  menuHeaderTitle: { ...AppTheme.textTheme.headlineSmall, color: AppTheme.highlightWhite, fontWeight: '700' },
  menuCloseButton: { padding: w(2), backgroundColor: AppTheme.cardColor, borderRadius: 8 },
  menuCircle: { borderRadius: 100, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  menuListItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: w(4), marginVertical: h(1), padding: w(4), backgroundColor: AppTheme.cardColor, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(220, 179, 53, 0.1)' },
  menuListItemIcon: { padding: w(2), backgroundColor: 'rgba(220, 179, 53, 0.1)', borderRadius: 8 },
  menuListItemText: { ...AppTheme.textTheme.titleMedium, fontWeight: '500', flex: 1 },
  menuFooter: { padding: w(4) },
  menuDivider: { height: 1, backgroundColor: AppTheme.cardColor },
  menuFooterLogoutText: { ...AppTheme.textTheme.titleMedium, color: AppTheme.errorRed, fontWeight: '500' },
  menuFooterVersionText: { ...AppTheme.textTheme.labelSmall, color: AppTheme.mediumGray, textAlign: 'center' },

  // Barcode Modal Styles
  enhancedBarcodeMenu: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000000', zIndex: 2000, overflow: 'hidden' },
  decorElement: { position: 'absolute', backgroundColor: AppTheme.accentYellow, borderRadius: 25 },
  decorElement1: { width: 150, height: 150, top: '15%', left: -75 },
  decorElement2: { width: 120, height: 120, top: '25%', right: -60 },
  decorElement3: { width: 100, height: 100, bottom: '30%', left: -50 },
  decorElement4: { width: 180, height: 180, bottom: '15%', right: -90 },
  concentricCircles: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -screenWidth/2 }, { translateY: -screenHeight/2 }] },
  circle: { position: 'absolute', borderWidth: 1, borderColor: 'rgba(220, 179, 53, 0.1)', borderRadius: 300, top: (screenHeight - 600)/2, left: (screenWidth-600)/2},
  circle1: { width: 600, height: 600 },
  circle2: { width: 500, height: 500, top: (screenHeight - 500)/2, left: (screenWidth-500)/2 },
  circle3: { width: 400, height: 400, top: (screenHeight - 400)/2, left: (screenWidth-400)/2 },
  enhancedBarcodeContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  userName: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginTop: 30, marginBottom: 8, textAlign: 'center' },
  loadingText: { fontSize: 18, color: '#FFFFFF', textAlign: 'center' },
  enhancedCloseButton: { position: 'absolute', top: h(6), right: w(5), width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center' },
  enhancedCloseButtonText: { fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' },
});