import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API from "../../services/api";

export default function ProjectsScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.error("Projects error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    const unsubscribe = navigation?.addListener("focus", fetchProjects);
    return unsubscribe;
  }, [navigation]);

  const updateStatus = async () => {
    if (!status) return;
    try {
      await API.put(`/projects/${selectedProject._id}`, { status });
      fetchProjects();
      setShowModal(false);
      setSelectedProject(null);
      setStatus("");
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#4CAF50";
      case "In Progress":
        return "#2196F3";
      case "On Hold":
        return "#FF9800";
      case "Partially Completed":
        return "#9C27B0";
      default:
        return "#888";
    }
  };

  const renderProject = ({ item }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => {
        setSelectedProject(item);
        setStatus(item.status);
        setShowModal(true);
      }}
    >
      <View style={styles.projectHeader}>
        <Text style={styles.clientName}>{item.clientName}</Text>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.projectDetails}>
        <Text style={styles.detailText}>
          Revenue: ₹{item.revenue.toLocaleString()}
        </Text>
        <Text style={styles.detailText}>
          Expected: {new Date(item.expectedTime).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.sourceText}>Source: {item.source}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search projects..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredProjects}
        renderItem={renderProject}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchProjects} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No projects found</Text>
        }
      />

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Status</Text>
            <Text style={styles.modalClient}>{selectedProject?.clientName}</Text>
            {["In Progress", "On Hold", "Partially Completed", "Completed"].map(
              (s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusOption,
                    status === s && styles.statusOptionActive,
                  ]}
                  onPress={() => setStatus(s)}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      status === s && styles.statusOptionTextActive,
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              )
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowModal(false);
                  setSelectedProject(null);
                  setStatus("");
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={updateStatus}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  projectCard: {
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
  projectHeader: {
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    color: "#555",
    fontSize: 14,
    marginBottom: 12,
  },
  projectDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailText: {
    color: "#666",
    fontSize: 12,
  },
  sourceText: {
    color: "#999",
    fontSize: 12,
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    color: "#2A3266",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  modalClient: {
    color: "#666",
    fontSize: 14,
    marginBottom: 20,
  },
  statusOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  statusOptionActive: {
    backgroundColor: "#5B6ABF",
    borderColor: "#5B6ABF",
  },
  statusOptionText: {
    color: "#666",
    fontSize: 16,
  },
  statusOptionTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FAFAFA",
    marginRight: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelText: {
    color: "#666",
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#5B6ABF",
    marginLeft: 8,
    alignItems: "center",
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
