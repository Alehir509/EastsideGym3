import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  Pressable,
  Platform, // <-- THE FIX IS HERE
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// --- Responsive Sizing & Theme (for a self-contained component) ---
const { width, height } = Dimensions.get('window');
const w = (percentage) => width * (percentage / 100);
const h = (percentage) => height * (percentage / 100);
const sp = (size) => size * (width / 375);

// A minimal theme object to match your Flutter AppTheme
const AppTheme = {
  accentYellow: '#DCB335',
  highlightWhite: '#FFFFFF',
  mediumGray: '#8E8E8E',
  successGreen: '#00C851',
  charcoalBlack: '#212121',
  cardColor: '#1C1C1E',
  shadowLight: 'rgba(0, 0, 0, 0.2)',
};

// --- The Rebuilt MetricCardWidget Component ---
const MetricCardWidget = ({
  title,
  value,
  subtitle,
  iconName,
  iconColor,
  progress,
  target,
  onTap,
  onLongPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.cardMargin}>
      <Pressable
        onPress={onTap}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
          {/* Top Section: Icon and Percentage Badge */}
          <View style={styles.topRow}>
            <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
              <Icon name={iconName} size={24} color={iconColor} />
            </View>
            <View style={[styles.badge, { backgroundColor: progress >= 1.0 ? `${AppTheme.successGreen}1A` : `${AppTheme.accentYellow}1A` }]}>
              <Text style={[styles.badgeText, { color: progress >= 1.0 ? AppTheme.successGreen : AppTheme.accentYellow }]}>
                {`${(progress * 100).toFixed(0)}%`}
              </Text>
            </View>
          </View>

          <SizedBox height={h(3)} />

          {/* Middle Section: Title, Value, and Subtitle */}
          <Text style={styles.titleText}>{title}</Text>
          <SizedBox height={h(1)} />
          <View style={styles.valueRow}>
            <Text style={styles.valueText}>{value}</Text>
            <SizedBox width={w(2)} />
            <Text style={styles.subtitleText}>{subtitle}</Text>
          </View>

          <SizedBox height={h(2)} />

          {/* Bottom Section: Progress Bar */}
          <View>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabelText}>Progress</Text>
              <Text style={styles.progressLabelText}>{target}</Text>
            </View>
            <SizedBox height={h(1)} />
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { backgroundColor: iconColor, width: `${progress * 100}%` }]} />
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
};

// Simple SizedBox replacement
const SizedBox = ({ width, height }) => <View style={{ width, height }} />;

// --- Styles for the MetricCardWidget ---
const styles = StyleSheet.create({
  cardMargin: {
    marginHorizontal: w(4),
    marginVertical: h(1.5),
  },
  cardContainer: {
    backgroundColor: AppTheme.cardColor,
    borderRadius: 16,
    padding: w(4),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: AppTheme.shadowLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    padding: w(3),
    borderRadius: 12,
  },
  badge: {
    paddingHorizontal: w(2),
    paddingVertical: h(0.5),
    borderRadius: 12,
  },
  badgeText: {
    fontSize: sp(10),
    fontWeight: '600',
  },
  titleText: {
    color: AppTheme.mediumGray,
    fontSize: sp(16),
    fontWeight: '500',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  valueText: {
    color: AppTheme.highlightWhite,
    fontSize: sp(28),
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  subtitleText: {
    color: AppTheme.mediumGray,
    fontSize: sp(14),
    fontWeight: '400',
    paddingBottom: h(0.5),
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: AppTheme.mediumGray,
    fontSize: sp(12),
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: AppTheme.charcoalBlack,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});

export default MetricCardWidget;