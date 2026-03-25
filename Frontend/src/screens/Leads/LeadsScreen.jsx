import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API from "../../services/api";

export default function LeadsScreen({ navigation }) {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (error) {
      console.error("Leads error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    const unsubscribe = navigation.addListener("focus", fetchLeads);
    return unsubscribe;
  }, [navigation]);

  const convertToProject = async (leadId) => {
    Alert.alert(
      "Convert to Project",
      "Are you sure you want to convert this lead to a project?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Convert",
          onPress: async () => {
            try {
              await API.post(`/projects/convert/${leadId}`);
              fetchLeads();
              Alert.alert("Success", "Lead converted to project");
            } catch (error) {
              Alert.alert("Error", "Failed to convert lead");
            }
          },
        },
      ]
    );
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderLead = ({ item }) => (
    <View style={styles.leadCard}>
      <View style={styles.leadHeader}>
        <Text style={styles.clientName}>{item.clientName}</Text>
        <View style={styles.sourceBadge}>
          <Text style={styles.sourceText}>{item.source}</Text>
        </View>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.leadDetails}>
        <Text style={styles.detailText}>
          Revenue: ₹{item.estimatedRevenue.toLocaleString()}
        </Text>
        <Text style={styles.detailText}>
          Expected: {new Date(item.expectedTime).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.convertButton}
        onPress={() => convertToProject(item._id)}
      >
        <Text style={styles.convertText}>Add to Projects</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search leads..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredLeads}
        renderItem={renderLead}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchLeads} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No leads found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDF5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#333",
    paddingVertical: 12,
    fontSize: 16,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  leadCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  leadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  clientName: {
    color: "#2A3266",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  sourceBadge: {
    backgroundColor: "#5B6ABF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sourceText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    color: "#555",
    fontSize: 14,
    marginBottom: 12,
  },
  leadDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailText: {
    color: "#666",
    fontSize: 12,
  },
  convertButton: {
    backgroundColor: "#5B6ABF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  convertText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});
