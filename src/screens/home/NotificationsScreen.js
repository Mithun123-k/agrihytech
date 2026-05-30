import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  StatusBar,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const scale = width / 375;

const initialNotifications = [
  {
    id: "1",
    title: "Pest Alert in Wheat Crops",
    message: "High chance of fungal infection due to humidity.",
    time: "12:45 PM",
    read: false,
    type: "alert",
  },
  {
    id: "2",
    title: "Rain Expected Tomorrow",
    message: "High chance of rainfall in next 48 hours.",
    time: "12:45 PM",
    read: false,
    type: "info",
  },
];

const NotificationsScreen = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [notifications, setNotifications] = useState(initialNotifications);

  // Toggle read/unread
  const toggleRead = (id) => {
    const updated = notifications.map((item) =>
      item.id === id ? { ...item, read: !item.read } : item
    );
    setNotifications(updated);
  };

  // Filter logic
  const filteredNotifications = notifications.filter((item) => {
    if (selectedTab === "Read") return item.read;
    if (selectedTab === "Unread") return !item.read;
    return true;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, item.read && styles.readCard]}
      onPress={() => toggleRead(item.id)}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              item.type === "alert" ? "#FFE5E5" : "#E5ECFF",
          },
        ]}
      >
        <Icon
          name={item.type === "alert" ? "alert" : "cloud"}
          size={18 * scale}
          color={item.type === "alert" ? "#FF4D4D" : "#4D79FF"}
        />
      </View>

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>

      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background Image Top */}
      <ImageBackground
        source={require("../../assets/images/bg1.png")}
        style={styles.bgImage}
        resizeMode="cover"
      >
        {/* <View style={styles.overlay} /> */}
      </ImageBackground>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={22 * scale} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 22 * scale }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["All", "Read", "Unread"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notification List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF2E9",
  },

  bgImage: {
    ...StyleSheet.absoluteFillObject,
    height: 180,
    
  },

  overlay: {
    // marginTop:'20%'
    // flex: 1,
    // backgroundColor: "rgba(255,255,255,0.6)",
  },

  header: {
    marginTop: '20%',
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18 * scale,
    fontWeight: "600",
  },

  tabs: {
    flexDirection: "row",
    marginTop: 15,
    paddingHorizontal: 20,
  },

  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
  },

  activeTab: {
    backgroundColor: "#4C8C2B",
  },

  tabText: {
    fontSize: 13 * scale,
    color: "#777",
  },

  activeTabText: {
    color: "#FFF",
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: 'flex-start',
  },

  readCard: {
    opacity: 0.6,
  },

  iconContainer: {
    width: 36 * scale,
    height: 36 * scale,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 14 * scale,
    fontWeight: "400",
    color: "#272727",
  },

  message: {
    fontSize: 12 * scale,
    fontWeight: "400",
    color: "#7F7F7F",
    marginTop: 3,
  },

  time: {
    fontSize: 11 * scale,
    color: "#999",
  },
});