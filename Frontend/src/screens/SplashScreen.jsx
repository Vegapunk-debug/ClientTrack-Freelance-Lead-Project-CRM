import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
    const navigation = useNavigation();
    const video = React.useRef(null);

    const features = [
        { icon: 'briefcase-outline', text: 'Project Tracking' },
        { icon: 'people-outline', text: 'Client CRM' },
        { icon: 'trending-up-outline', text: 'Lead Insights' },
    ];

    return (
        <View style={styles.container}>
            <Video
                ref={video}
                style={styles.video}
                source={require('../../assets/splash.mp4')}
                resizeMode="cover"
                shouldPlay
                isLooping
                isMuted
            />

            <View style={styles.overlay} />

            <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>ClientTrack</Text>
                    <Text style={styles.subtitle}>
                        Manage your freelance projects with ease.
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>GET STARTED</Text>
                    <View style={styles.iconContainer}>
                        <Ionicons name="arrow-forward" size={24} color="white" />
                    </View>
                </TouchableOpacity>


                <View style={styles.featuresContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuresScroll}>
                        {features.map((feature, index) => (
                            <View key={index} style={styles.featureTag}>
                                <Ionicons name={feature.icon} size={16} color="#E0E0E0" style={styles.featureIcon} />
                                <Text style={styles.featureText}>{feature.text}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    video: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    textContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 12,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 18,
        color: '#E0E0E0',
        lineHeight: 26,
        maxWidth: '80%',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 100,
        paddingVertical: 6,
        paddingHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        color: '#000000',
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 20,
        letterSpacing: 0.5,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featuresContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    featuresScroll: {
        gap: 12,
    },
    featureTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    featureIcon: {
        marginRight: 8,
    },
    featureText: {
        color: '#E0E0E0',
        fontSize: 14,
        fontWeight: '500',
    },
});
