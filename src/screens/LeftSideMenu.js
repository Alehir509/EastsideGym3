// LeftSideMenu.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const LeftSideMenu = ({ menuSlideAnim, menuOpacityAnim, handleLogout, isMenuOpen }) => {
  return (
    <Animated.View
      style={[
        styles.menu,
        {
          transform: [{ translateX: menuSlideAnim }],
          opacity: menuOpacityAnim,
        },
      ]}
    >
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>Menu</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%', // Use percentage for responsiveness
    height: '100%',
    backgroundColor: '#000',
    zIndex: 1,
  },
  menuContent: {
    paddingTop: 70,
    paddingHorizontal: 16,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuItemText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default LeftSideMenu;