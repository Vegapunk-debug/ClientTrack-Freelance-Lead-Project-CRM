import { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, Image } from "react-native";
import { AuthContext } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ navigation }) {
  const { user, logoutUser, updateUserData } = useContext(AuthContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [loading, setLoading] = useState(false);

  // Update local state when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setProfileImage(user.profileImage || null);
    }
  }, [user]);

  // Request permissions on component mount
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to change your profile photo!'
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        
        // Upload image to server
        await uploadProfileImage(imageUri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const uploadProfileImage = async (imageUri) => {
    // Note: Image upload endpoint not implemented yet
    // For now, just store locally
    try {
      // TODO: Implement image upload endpoint in backend
      // const formData = new FormData();
      // formData.append('profileImage', {
      //   uri: imageUri,
      //   type: 'image/jpeg',
      //   name: 'profile.jpg',
      // });
      // const res = await API.post("/user/upload-profile-image", formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });
      
      // Temporarily store locally until backend is implemented
      setProfileImage(imageUri);
      updateUserData({ ...user, profileImage: imageUri });
      Alert.alert('Success', 'Profile photo updated! (Note: Image upload to server not yet implemented)');
    } catch (err) {
      Alert.alert('Error', 'Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    setLoading(true);
    try {
      const res = await API.put("/user/profile", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
      });
      
      // Update context with new user data
      updateUserData(res.data.user);
      
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logoutUser(),
        },
      ]
    );
  };

  const navigateToNotifications = () => {
    Alert.alert('Coming Soon', 'Notifications feature will be available soon!');
  };

  const navigateToPrivacy = () => {
    Alert.alert('Coming Soon', 'Privacy & Security settings will be available soon!');
  };

  const navigateToHelp = () => {
    Alert.alert('Help & Support', 'For support, please contact us at support@clienttrack.com');
  };

  const navigateToAbout = () => {
    Alert.alert(
      'ClientTrack',
      'Version 1.0.0\n\nA specialized CRM for freelance designers and developers.\n\n©️ 2024 ClientTrack',
      [{ text: 'OK' }]
    );
  };

  const cancelEdit = () => {
    // Reset to original values
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setBio(user?.bio || "");
    setIsEditing(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {profileImage ? (
            <Image 
              source={{ uri: profileImage }} 
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {name.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.editAvatarButton}
            onPress={pickImage}
          >
            <Text style={styles.editAvatarText}>
              {profileImage ? 'Change Photo' : 'Add Photo'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>{name || 'User'}</Text>
        <Text style={styles.userRole}>Freelance Designer</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Active Leads</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>$45K</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      {/* Profile Information Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Profile Information</Text>
          <TouchableOpacity 
            onPress={() => isEditing ? cancelEdit() : setIsEditing(true)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? "Cancel" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={name}
            onChangeText={setName}
            editable={isEditing}
            placeholder="Enter your full name"
            placeholderTextColor="#A0A8D4"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="your@email.com"
            placeholderTextColor="#A0A8D4"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={phone}
            onChangeText={setPhone}
            editable={isEditing}
            placeholder="Add phone number"
            keyboardType="phone-pad"
            placeholderTextColor="#A0A8D4"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.textArea, !isEditing && styles.inputDisabled]}
            value={bio}
            onChangeText={setBio}
            editable={isEditing}
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#A0A8D4"
          />
        </View>

        {isEditing && (
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Settings Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Settings</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={navigateToNotifications}
        >
          <Text style={styles.settingText}>Notifications</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.settingDivider} />

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={navigateToPrivacy}
        >
          <Text style={styles.settingText}>Privacy & Security</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.settingDivider} />

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={navigateToHelp}
        >
          <Text style={styles.settingText}>Help & Support</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.settingDivider} />

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={navigateToAbout}
        >
          <Text style={styles.settingText}>About ClientTrack</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FE",
  },
  header: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#5E6CA8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#5E6CA8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#5E6CA8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    shadowColor: "#5E6CA8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  editAvatarButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  editAvatarText: {
    color: "#5E6CA8",
    fontSize: 14,
    fontWeight: "600",
  },
  userName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2C3E86",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 15,
    color: "#7B89D8",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    justifyContent: "space-around",
    shadowColor: "#5E6CA8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E86",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#A0A8D4",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E8EBFF",
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#5E6CA8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E86",
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F5F7FF",
  },
  editButtonText: {
    color: "#5E6CA8",
    fontSize: 14,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5E6CA8",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F5F7FF",
    borderWidth: 1.5,
    borderColor: "#D4DCFC",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    color: "#2C3E86",
  },
  inputDisabled: {
    backgroundColor: "#FAFBFF",
    borderColor: "#E8EBFF",
    color: "#7B89D8",
  },
  textArea: {
    backgroundColor: "#F5F7FF",
    borderWidth: 1.5,
    borderColor: "#D4DCFC",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    color: "#2C3E86",
    height: 100,
  },
  saveButton: {
    backgroundColor: "#5E6CA8",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#5E6CA8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  settingText: {
    fontSize: 15,
    color: "#2C3E86",
    fontWeight: "500",
  },
  settingArrow: {
    fontSize: 24,
    color: "#A0A8D4",
    fontWeight: "300",
  },
  settingDivider: {
    height: 1,
    backgroundColor: "#E8EBFF",
  },
  logoutButton: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FF6B6B",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutButtonText: {
    color: "#FF6B6B",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  bottomSpacer: {
    height: 40,
  },
});
