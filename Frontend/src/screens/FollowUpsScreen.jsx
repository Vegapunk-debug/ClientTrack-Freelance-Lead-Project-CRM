import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API from "../services/api";

export default function FollowUpsScreen({ navigation }) {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("today");

  const fetchFollowUps = async () => {
    try {
      const res = await API.get("/projects/dashboard");
      const allFollowUps = res.data.followUps || [];
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let filtered = [];
      if (filter === "today") {
        filtered = allFollowUps.filter((item) => {
          const date = new Date(item.type === "lead" ? item.followUpDate : item.expectedTime);
          date.setHours(0, 0, 0, 0);
          return date.getTime() === today.getTime();
        });
      } else if (filter === "upcoming") {
        filtered = allFollowUps.filter((item) => {
          const date = new Date(item.type === "lead" ? item.followUpDate : item.expectedTime);
          date.setHours(0, 0, 0, 0);
          return date.getTime() > today.getTime();
        });
      } else {
        filtered = allFollowUps;
      }
      
      setFollowUps(filtered);
    } catch (error) {
      console.error("Follow-ups error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
    const unsubscribe = navigation?.addListener("focus", fetchFollowUps);
    return unsubscribe;
  }, [navigation, filter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntil = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return "Overdue";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days} days`;
  };

  const renderFollowUp = ({ item }) => {
    const date = new Date(item.type === "lead" ? item.followUpDate : item.expectedTime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const hourAngle = (hours % 12) * 30 + minutes * 0.5;
    const minuteAngle = minutes * 6;
    const timeUntil = getTimeUntil(item.type === "lead" ? item.followUpDate : item.expectedTime);

    return (
      <TouchableOpacity
        style={styles.followUpCard}
        onPress={() => {
          if (item.type === "lead") {
            navigation.navigate("Leads");
          } else {
            navigation.navigate("Projects");
          }
        }}
      >
        <View style={styles.followUpLeft}>
          <View style={styles.clockContainer}>
            <View style={styles.clockFace}>
              <View
                style={[
                  styles.hourHand,
                  { transform: [{ rotate: `${hourAngle}deg` }] },
                ]}
              />
              <View
                style={[
                  styles.minuteHand,
                  { transform: [{ rotate: `${minuteAngle}deg` }] },
                ]}
              />
              <View style={styles.clockCenter} />
            </View>
          </View>
        </View>
        <View style={styles.followUpRight}>
          <View style={styles.followUpHeader}>
            <Text style={styles.clientName}>{item.clientName}</Text>
            <View
              style={[
                styles.typeBadge,
                item.type === "lead"
                  ? styles.leadBadge
                  : styles.projectBadge,
              ]}
            >
              <Text style={styles.typeText}>
                {item.type === "lead" ? "Lead" : "Project"}
              </Text>
            </View>
          </View>
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <View style={styles.followUpDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={14} color="#666" />
              <Text style={styles.detailText}>
                {formatDate(
                  item.type === "lead" ? item.followUpDate : item.expectedTime
                )}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.detailText}>
                {formatTime(
                  item.type === "lead" ? item.followUpDate : item.expectedTime
                )}
              </Text>
            </View>
          </View>
          <View style={styles.timeUntilContainer}>
            <Text
              style={[
                styles.timeUntil,
                timeUntil === "Overdue" && styles.overdue,
              ]}
            >
              {timeUntil}
            </Text>
            {item.type === "project" && item.revenue && (
              <Text style={styles.revenue}>
                ₹{item.revenue.toLocaleString()}
              </Text>
            )}
            {item.type === "lead" && item.estimatedRevenue && (
              <Text style={styles.revenue}>
                ₹{item.estimatedRevenue.toLocaleString()}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "today" && styles.filterActive]}
          onPress={() => setFilter("today")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "today" && styles.filterTextActive,
            ]}
          >
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "upcoming" && styles.filterActive]}
          onPress={() => setFilter("upcoming")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "upcoming" && styles.filterTextActive,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.filterActive]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={followUps}
        renderItem={renderFollowUp}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchFollowUps} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#E0E0E0" />
            <Text style={styles.emptyText}>No follow-ups found</Text>
            <Text style={styles.emptySubtext}>
              {filter === "today"
                ? "You're all caught up for today!"
                : "No upcoming follow-ups"}
            </Text>
          </View>
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
  filterContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  filterActive: {
    backgroundColor: "#5B6ABF",
    borderColor: "#5B6ABF",
  },
  filterText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  followUpCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  followUpLeft: {
    marginRight: 16,
  },
  clockContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  clockFace: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FAFAFA",
    borderWidth: 2,
    borderColor: "#5B6ABF",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  hourHand: {
    width: 3,
    height: 18,
    backgroundColor: "#5B6ABF",
    position: "absolute",
    bottom: "50%",
    transformOrigin: "bottom center",
  },
  minuteHand: {
    width: 2,
    height: 22,
    backgroundColor: "#5B6ABF",
    position: "absolute",
    bottom: "50%",
    transformOrigin: "bottom center",
  },
  clockCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#5B6ABF",
    position: "absolute",
  },
  followUpRight: {
    flex: 1,
  },
  followUpHeader: {
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
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  leadBadge: {
    backgroundColor: "#E8EAF6",
  },
  projectBadge: {
    backgroundColor: "#F3E5F5",
  },
  typeText: {
    color: "#5B6ABF",
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    color: "#555",
    fontSize: 14,
    marginBottom: 12,
  },
  followUpDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    color: "#666",
    fontSize: 12,
  },
  timeUntilContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  timeUntil: {
    color: "#5B6ABF",
    fontSize: 12,
    fontWeight: "600",
  },
  overdue: {
    color: "#F44336",
  },
  revenue: {
    color: "#2A3266",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    color: "#999",
    fontSize: 14,
    marginTop: 8,
  },
});

