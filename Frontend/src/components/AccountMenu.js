import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Animated,
    Modal,
    Image,
    useColorScheme,
    Platform,
    Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AccountMenu = ({
    name,
    email,
    avatarUrl,
    onProfilePress = () => { },
    onSignOut = () => { },
}) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Animation values
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const chevronRotation = useRef(new Animated.Value(0)).current;

    // Toggle menu visibility
    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    // Close menu
    const closeMenu = () => {
        setIsMenuVisible(false);
    };

    // Animate menu opening/closing
    useEffect(() => {
        if (isMenuVisible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(chevronRotation, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(chevronRotation, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isMenuVisible]);

    // Chevron rotation interpolation
    const chevronRotate = chevronRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    // Handle profile press
    const handleProfilePress = () => {
        closeMenu();
        onProfilePress();
    };

    // Handle sign out
    const handleSignOut = () => {
        closeMenu();
        onSignOut();
    };

    // Get initials from name
    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };
    const dynamicStyles = {
        avatar: {
            backgroundColor: isDark ? '#4A5568' : '#E2E8F0',
        },
        avatarText: {
            color: isDark ? '#E2E8F0' : '#2D3748',
        },
        menuCard: {
            backgroundColor: isDark ? '#1A202C' : '#FFFFFF',
            shadowColor: isDark ? '#000000' : '#000000',
        },
        userName: {
            color: isDark ? '#F7FAFC' : '#1A202C',
        },
        userEmail: {
            color: isDark ? '#A0AEC0' : '#718096',
        },
        divider: {
            backgroundColor: isDark ? '#2D3748' : '#E2E8F0',
        },
        menuItemText: {
            color: isDark ? '#E2E8F0' : '#2D3748',
        },
        signOutText: {
            color: isDark ? '#FC8181' : '#E53E3E',
        },
        modalBackground: {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)',
        },
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={toggleMenu}
                style={({ pressed }) => [
                    styles.avatarButton,
                    pressed && styles.avatarButtonPressed,
                ]}
            >
                <View style={[styles.avatar, dynamicStyles.avatar]}>
                    {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                    ) : (
                        <Text style={[styles.avatarText, dynamicStyles.avatarText]}>
                            {getInitials(name)}
                        </Text>
                    )}
                </View>
                <Animated.View
                    style={[
                        styles.chevronContainer,
                        { transform: [{ rotate: chevronRotate }] },
                    ]}
                >
                    <Text style={[styles.chevron, dynamicStyles.menuItemText]}>▼</Text>
                </Animated.View>
            </Pressable>

            <Modal
                visible={isMenuVisible}
                transparent
                animationType="none"
                onRequestClose={closeMenu}
            >
                <Pressable
                    style={[styles.modalOverlay, dynamicStyles.modalBackground]}
                    onPress={closeMenu}
                >
                    <View style={styles.menuContainer}>
                        <Animated.View
                            style={[
                                styles.menuCard,
                                dynamicStyles.menuCard,
                                {
                                    opacity: opacityAnim,
                                    transform: [{ scale: scaleAnim }],
                                },
                            ]}
                        >
                            {/* User Info Section */}
                            <View style={styles.userInfoSection}>
                                <View style={[styles.avatarLarge, dynamicStyles.avatar]}>
                                    {avatarUrl ? (
                                        <Image
                                            source={{ uri: avatarUrl }}
                                            style={styles.avatarImageLarge}
                                        />
                                    ) : (
                                        <Text style={[styles.avatarTextLarge, dynamicStyles.avatarText]}>
                                            {getInitials(name)}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.userTextContainer}>
                                    <Text style={[styles.userName, dynamicStyles.userName]} numberOfLines={1}>
                                        {name || 'User'}
                                    </Text>
                                    <Text style={[styles.userEmail, dynamicStyles.userEmail]} numberOfLines={1}>
                                        {email || 'No email'}
                                    </Text>
                                </View>
                            </View>


                            <View style={[styles.divider, dynamicStyles.divider]} />
                            <View style={styles.menuItems}>
                                <Pressable
                                    onPress={handleProfilePress}
                                    style={({ pressed }) => [
                                        styles.menuItem,
                                        pressed && styles.menuItemPressed,
                                    ]}
                                >
                                    <Text style={styles.menuIcon}>👤</Text>
                                    <Text style={[styles.menuItemText, dynamicStyles.menuItemText]}>
                                        Profile
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={handleSignOut}
                                    style={({ pressed }) => [
                                        styles.menuItem,
                                        pressed && styles.menuItemPressed,
                                    ]}
                                >
                                    <Text style={[styles.menuItemText, dynamicStyles.signOutText]}>
                                        Sign Out
                                    </Text>
                                </Pressable>
                            </View>
                        </Animated.View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    avatarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 4,
    },
    avatarButtonPressed: {
        opacity: 0.7,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    avatarText: {
        fontSize: 14,
        fontWeight: '600',
    },
    chevronContainer: {
        marginLeft: 2,
    },
    chevron: {
        fontSize: 10,
        opacity: 0.6,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    menuContainer: {
        marginTop: Platform.OS === 'ios' ? 60 : 50,
        marginRight: 16,
    },
    menuCard: {
        minWidth: 280,
        maxWidth: SCREEN_WIDTH - 32,
        borderRadius: 16,
        paddingVertical: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    userInfoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    avatarLarge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImageLarge: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    avatarTextLarge: {
        fontSize: 18,
        fontWeight: '600',
    },
    userTextContainer: {
        flex: 1,
        gap: 2,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    userEmail: {
        fontSize: 13,
        letterSpacing: 0.1,
    },
    divider: {
        height: 1,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    menuItems: {
        paddingHorizontal: 8,
        gap: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 12,
    },
    menuItemPressed: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    menuItemText: {
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
});

export default AccountMenu;
