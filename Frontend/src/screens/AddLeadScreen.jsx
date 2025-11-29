import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import API from "../services/api";

export default function AddLeadScreen({ navigation }) {
  const [clientName, setClientName] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [source, setSource] = useState("LinkedIn");
  const [description, setDescription] = useState("");
  const [estimatedRevenue, setEstimatedRevenue] = useState("");
  const [expectedTime, setExpectedTime] = useState(new Date());
  const [followUpDate, setFollowUpDate] = useState(new Date());
  const [showExpectedTime, setShowExpectedTime] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const sources = ["LinkedIn", "Instagram", "Unstop", "X"];

  const handleSubmit = async () => {
    if (!clientName || !contactDetails || !description || !estimatedRevenue) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await API.post("/leads", {
        clientName,
        contactDetails,
        source,
        description,
        estimatedRevenue: parseFloat(estimatedRevenue),
        expectedTime,
        followUpDate,
      });
      Alert.alert("Success", "Lead added successfully", [
        { text: "OK", onPress: () => navigation.navigate("Leads") },
      ]);
      setClientName("");
      setContactDetails("");
      setDescription("");
      setEstimatedRevenue("");
      setExpectedTime(new Date());
      setFollowUpDate(new Date());
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to add lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Client Name</Text>
        <TextInput
          style={styles.input}
          value={clientName}
          onChangeText={setClientName}
          placeholder="Enter client name"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Contact Details</Text>
        <TextInput
          style={styles.input}
          value={contactDetails}
          onChangeText={setContactDetails}
          placeholder="Email or phone"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Source</Text>
        <View style={styles.sourceContainer}>
          {sources.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.sourceButton, source === s && styles.sourceButtonActive]}
              onPress={() => setSource(s)}
            >
              <Text style={[styles.sourceText, source === s && styles.sourceTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="One line description"
          placeholderTextColor="#999"
          multiline
        />

        <Text style={styles.label}>Estimated Revenue</Text>
        <TextInput
          style={styles.input}
          value={estimatedRevenue}
          onChangeText={(text) => {
            // Only allow numbers and decimal point
            const numericValue = text.replace(/[^0-9.]/g, '');
            // Prevent multiple decimal points
            const parts = numericValue.split('.');
            if (parts.length > 2) {
              setEstimatedRevenue(parts[0] + '.' + parts.slice(1).join(''));
            } else {
              setEstimatedRevenue(numericValue);
            }
          }}
          placeholder="Enter amount"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Expected Time</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowExpectedTime(true)}
        >
          <Text style={styles.dateText}>
            {expectedTime.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showExpectedTime && (
          <DateTimePicker
            value={expectedTime}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowExpectedTime(false);
              if (date) setExpectedTime(date);
            }}
          />
        )}

        <Text style={styles.label}>Follow-up Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowFollowUp(true)}
        >
          <Text style={styles.dateText}>
            {followUpDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showFollowUp && (
          <DateTimePicker
            value={followUpDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowFollowUp(false);
              if (date) setFollowUpDate(date);
            }}
          />
        )}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? "Adding..." : "Add Lead"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDF5",
  },
  form: {
    padding: 20,
  },
  label: {
    color: "#666",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "#FAFAFA",
    color: "#333",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  sourceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sourceButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sourceButtonActive: {
    backgroundColor: "#5B6ABF",
    borderColor: "#5B6ABF",
  },
  sourceText: {
    color: "#666",
    fontSize: 14,
  },
  sourceTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  dateButton: {
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dateText: {
    color: "#333",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#5B6ABF",
    padding: 16,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#5B6ABF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
});

