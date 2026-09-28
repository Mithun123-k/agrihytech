import AppText from '../../components/common/AppText';
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Dimensions,
    StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { infoPages } from "../../data/infoPages";
import { useSelector } from 'react-redux';
import { getTermsForRole } from '../../data/terms';
import { privacyPolicy } from '../../data/privacy';

const { width } = Dimensions.get("window");
const scale = width / 375;

const InfoScreen = ({ navigation, route }) => {

    const { id, role } = route.params;
    const sessionRole = useSelector(state => state.auth.user?.role);

    const [page, setPage] = useState(null);

    useEffect(() => {
        const foundPage = id === 2 ? getTermsForRole(role || sessionRole) : id === 3 ? privacyPolicy : infoPages.find(item => item.id === id);
        setPage(foundPage);
    }, [id, role, sessionRole]);

    if (!page) {
        return (
            <View style={styles.container}>
                <AppText>Loading...</AppText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Background */}
            <ImageBackground
                source={require("../../assets/images/bg1.png")}
                style={styles.bg}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={22 * scale} color="#222" />
                </TouchableOpacity>

                <AppText style={styles.headerTitle}>{page.title}</AppText>

                <View style={{ width: 22 * scale }} />
            </View>

            {/* Content */}
            <ScrollView
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {page.subtitle ? <AppText style={styles.subtitle}>{page.subtitle}</AppText> : null}
                {page.updated ? <AppText style={styles.updated}>Last Updated: {page.updated}</AppText> : null}
                {page.sections ? page.sections.map(section => <View key={section.heading} style={styles.section}>
                    <AppText style={styles.sectionTitle}>{section.heading}</AppText>
                    <AppText style={styles.description}>{section.body}</AppText>
                </View>) : <AppText style={styles.description}>{page.content}</AppText>}
            </ScrollView>
        </View>
    );
};

export default InfoScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#EDF2E9"
    },

    bg: {
        position: "absolute",
        width: "100%",
        height: 180
    },

    header: {
        paddingHorizontal: 20,
        paddingTop: "15%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    headerTitle: {
        fontSize: 18 * scale,
        fontWeight: "600"
    },

    contentContainer: {
        paddingHorizontal: 20,
        marginTop: 30,
        paddingBottom: 40
    },

    description: {
        fontSize: 14 ,
        fontWeight:'400',
        lineHeight: 20,
        color: "#555"
    },
    subtitle: { fontSize: 15, fontWeight: '600', color: '#385F21', marginBottom: 6 },
    updated: { fontSize: 13, color: '#777', marginBottom: 22 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 7 }

});
