import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Platform,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import API from '../../services/api';

export default function ProjectButtonScreen({ navigation, route }) {
    // Auto-fill from lead if available
    const leadData = route?.params?.leadData;

    // Form state
    const [clientName, setClientName] = useState(leadData?.clientName || '');
    const [contact, setContact] = useState(leadData?.contact || '');
    const [projectName, setProjectName] = useState('');
    const [projectType, setProjectType] = useState('Fixed Price');
    const [expectedValue, setExpectedValue] = useState('');
    const [projectStatus, setProjectStatus] = useState('Discussion');
    const [source, setSource] = useState('LinkedIn');
    const [followUpDate, setFollowUpDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [notes, setNotes] = useState('');

    // Handle date change
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || followUpDate;
        setShowDatePicker(Platform.OS === 'ios');
        setFollowUpDate(currentDate);
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Validate required fields
        if (!clientName || !projectName || !expectedValue || !source) {
            Alert.alert('Validation Error', 'Please fill in all required fields');
            return;
        }

        // Map form fields to backend model
        const projectData = {
            clientName,
            contactDetails: contact || 'N/A', // Backend requires this field
            description: projectName, // projectName maps to description
            source: source, // Must be one of: LinkedIn, Instagram, Unstop, X
            revenue: parseFloat(expectedValue) || 0,
            expectedTime: followUpDate, // followUpDate maps to expectedTime
            status: projectStatus === 'Discussion' ? 'In Progress' : projectStatus, // Map Discussion to In Progress
        };

        try {
            await API.post('/projects', projectData);
            Alert.alert('Success', 'Project created successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Project creation error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to create project. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Add Project</Text>
                        <Text style={styles.headerSubtitle}>Create a new project entry</Text>
                    </View>

                    {/* 1. Client Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Client Details</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Client Name <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={clientName}
                                onChangeText={setClientName}
                                placeholder="Enter client name"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Contact (optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={contact}
                                onChangeText={setContact}
                                placeholder="Enter contact number"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* 2. Project Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Project Details</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Project Name <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={projectName}
                                onChangeText={setProjectName}
                                placeholder="e.g., Logo Design, Portfolio Website"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Project Type <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.radioGroup}>
                                <TouchableOpacity
                                    style={[
                                        styles.radioButton,
                                        projectType === 'Fixed Price' && styles.radioButtonActive,
                                    ]}
                                    onPress={() => setProjectType('Fixed Price')}
                                >
                                    <Text
                                        style={[
                                            styles.radioText,
                                            projectType === 'Fixed Price' && styles.radioTextActive,
                                        ]}
                                    >
                                        Fixed Price
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.radioButton,
                                        projectType === 'Hourly' && styles.radioButtonActive,
                                    ]}
                                    onPress={() => setProjectType('Hourly')}
                                >
                                    <Text
                                        style={[
                                            styles.radioText,
                                            projectType === 'Hourly' && styles.radioTextActive,
                                        ]}
                                    >
                                        Hourly
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Expected Value (₹) <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={expectedValue}
                                onChangeText={setExpectedValue}
                                placeholder="Enter amount"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Project Status <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.statusGrid}>
                                {['Discussion', 'In Progress', 'Completed', 'On Hold'].map((status) => (
                                    <TouchableOpacity
                                        key={status}
                                        style={[
                                            styles.statusButton,
                                            projectStatus === status && styles.statusButtonActive,
                                        ]}
                                        onPress={() => setProjectStatus(status)}
                                    >
                                        <Text
                                            style={[
                                                styles.statusText,
                                                projectStatus === status && styles.statusTextActive,
                                            ]}
                                        >
                                            {status}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Source <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.categoryGrid}>
                                {['LinkedIn', 'Instagram', 'Unstop', 'X'].map((src) => (
                                    <TouchableOpacity
                                        key={src}
                                        style={[
                                            styles.categoryButton,
                                            source === src && styles.categoryButtonActive,
                                        ]}
                                        onPress={() => setSource(src)}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                source === src && styles.categoryTextActive,
                                            ]}
                                        >
                                            {src}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* 3. Follow-up */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Follow-up</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Follow-up Date <Text style={styles.required}>*</Text>
                            </Text>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateText}>
                                    {followUpDate.toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={followUpDate}
                                    mode="date"
                                    display="default"
                                    onChange={onDateChange}
                                />
                            )}
                        </View>
                    </View>

                    {/* 4. Notes */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Notes / Requirements</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Notes (optional)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="Scope, special instructions, deadlines, etc."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    {/* Submit Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>Add Project</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7B89D8', // Main background
    },
    scrollView: {
        flex: 1,
    },
    formContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
        paddingTop: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF', // Headings
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#E8EBFF', // Light text on colored bg
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF', // Headings
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#D4DCFC', // Borders
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#E8EBFF', // Light text
        marginBottom: 8,
    },
    required: {
        color: '#EF4444', // Keep red for required
    },
    input: {
        backgroundColor: '#F5F7FF', // Input fields background
        borderWidth: 1,
        borderColor: '#D4DCFC', // Borders
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#2C3E86', // Input text
    },
    textArea: {
        minHeight: 100,
        paddingTop: 12,
    },
    radioGroup: {
        flexDirection: 'row',
        gap: 12,
    },
    radioButton: {
        flex: 1,
        backgroundColor: '#F5F7FF',
        borderWidth: 2,
        borderColor: '#D4DCFC',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    radioButtonActive: {
        backgroundColor: '#5E6CA8', // Primary buttons
        borderColor: '#5E6CA8',
    },
    radioText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#5E6CA8', // Labels/Primary
    },
    radioTextActive: {
        color: '#FFFFFF',
    },
    statusGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    statusButton: {
        backgroundColor: '#F5F7FF',
        borderWidth: 2,
        borderColor: '#D4DCFC',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    statusButtonActive: {
        backgroundColor: '#5E6CA8', // Using Primary for active status to match palette
        borderColor: '#5E6CA8',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#5E6CA8',
    },
    statusTextActive: {
        color: '#FFFFFF',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryButton: {
        backgroundColor: '#F5F7FF',
        borderWidth: 2,
        borderColor: '#D4DCFC',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    categoryButtonActive: {
        backgroundColor: '#5E6CA8', // Using Primary for active category
        borderColor: '#5E6CA8',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#5E6CA8',
    },
    categoryTextActive: {
        color: '#FFFFFF',
    },
    dateButton: {
        backgroundColor: '#F5F7FF',
        borderWidth: 1,
        borderColor: '#D4DCFC',
        borderRadius: 8,
        padding: 12,
    },
    dateText: {
        fontSize: 16,
        color: '#2C3E86',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F5F7FF',
        borderWidth: 2,
        borderColor: '#D4DCFC',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#5E6CA8',
    },
    submitButton: {
        flex: 1,
        backgroundColor: '#5E6CA8', // Primary button
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#2C3E86',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
