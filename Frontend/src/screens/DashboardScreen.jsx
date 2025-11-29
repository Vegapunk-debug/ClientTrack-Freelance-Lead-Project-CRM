import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API from "../services/api";

export default function DashboardScreen({ navigation }) {
  const [dashboardData, setDashboardData] = useState({
    followUps: [],
    priorityProjects: [],
    expectedRevenue: 0,
    leadsCount: 0,
    projectsCount: 0,
    projectsByStatus: {},
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/projects/dashboard");
      setDashboardData(res.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const unsubscribe = navigation?.addListener("focus", fetchDashboard);
    const interval = setInterval(fetchDashboard, 60000);
    return () => {
      clearInterval(interval);
      unsubscribe?.();
    };
  }, [navigation]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
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

  // Use priorityProjects from backend, or fallback to filtering followUps for backward compatibility
  const priorityProjects = (dashboardData.priorityProjects || dashboardData.followUps.filter(item => item.type === "project"))
    .slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchDashboard} />
      }
    >
      <View style={styles.followUpWidget}>
        <View style={styles.widgetHeader}>
          <Text style={styles.widgetTitle}>Priority Projects</Text>
          <Text style={styles.widgetSubtitle}>Sorted by deadlines</Text>
        </View>
        {priorityProjects.length === 0 ? (
          <Text style={styles.emptyText}>No priority projects</Text>
        ) : (
          priorityProjects.map((item, index) => {
            const date = new Date(item.expectedTime);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const hourAngle = (hours % 12) * 30 + minutes * 0.5;
            const minuteAngle = minutes * 6;
            const timeUntil = getTimeUntil(item.expectedTime);
            
            return (
              <TouchableOpacity
                key={index}
                style={styles.followUpItem}
                onPress={() => navigation.navigate("Projects")}
              >
                <View style={styles.followUpLeft}>
                  <View style={styles.clockContainer}>
                    <View style={styles.clockFace}>
                      <View style={[styles.hourHand, { transform: [{ rotate: `${hourAngle}deg` }] }]} />
                      <View style={[styles.minuteHand, { transform: [{ rotate: `${minuteAngle}deg` }] }]} />
                      <View style={styles.clockCenter} />
                    </View>
                  </View>
                </View>
                <View style={styles.followUpRight}>
                  <View style={styles.followUpHeader}>
                    <Text style={styles.followUpClient}>{item.clientName}</Text>
                    <View style={[styles.urgencyBadge, timeUntil === "Overdue" && styles.overdueBadge]}>
                      <Text style={[styles.urgencyText, timeUntil === "Overdue" && styles.overdueText]}>
                        {timeUntil}
                      </Text>
                    </View>
                  </View>
                  {item.description && (
                    <Text style={styles.description} numberOfLines={1}>
                      {item.description}
                    </Text>
                  )}
                  <View style={styles.followUpDetails}>
                    <Text style={styles.followUpTime}>
                      {formatDate(item.expectedTime)} • {formatTime(item.expectedTime)}
                    </Text>
                    {item.revenue && (
                      <Text style={styles.revenueText}>
                        ₹{item.revenue.toLocaleString()}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <View style={styles.revenueCard}>
        <View style={styles.revenueHeader}>
          <Ionicons name="cash-outline" size={24} color="#5B6ABF" />
          <View style={styles.revenueHeaderText}>
            <Text style={styles.revenueLabel}>Expected Revenue</Text>
            <Text style={styles.revenueAmount}>
              ₹{dashboardData.expectedRevenue.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Analytics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboardData.leadsCount}</Text>
            <Text style={styles.statLabel}>Total Leads</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboardData.projectsCount}</Text>
            <Text style={styles.statLabel}>Total Projects</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {dashboardData.projectsByStatus?.["In Progress"] || 0}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {dashboardData.projectsByStatus?.["Completed"] || 0}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDF5",
  },
  followUpWidget: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  widgetHeader: {
    marginBottom: 16,
  },
  widgetTitle: {
    color: "#2A3266",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  widgetSubtitle: {
    color: "#999",
    fontSize: 12,
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 20,
  },
  followUpItem: {
    flexDirection: "row",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  followUpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  urgencyBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  overdueBadge: {
    backgroundColor: "#FFEBEE",
  },
  urgencyText: {
    color: "#4CAF50",
    fontSize: 10,
    fontWeight: "600",
  },
  overdueText: {
    color: "#F44336",
    fontSize: 10,
    fontWeight: "600",
  },
  description: {
    color: "#666",
    fontSize: 12,
    marginBottom: 8,
  },
  followUpDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  revenueText: {
    color: "#5B6ABF",
    fontSize: 14,
    fontWeight: "600",
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
  followUpClient: {
    color: "#2A3266",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  followUpType: {
    color: "#5B6ABF",
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "600",
  },
  followUpTime: {
    color: "#666",
    fontSize: 12,
  },
  revenueCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  revenueHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  revenueHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  revenueLabel: {
    color: "#666",
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "600",
  },
  revenueAmount: {
    color: "#5B6ABF",
    fontSize: 28,
    fontWeight: "bold",
  },
  analyticsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  analyticsTitle: {
    color: "#2A3266",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    color: "#2A3266",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },
});
