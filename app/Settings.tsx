import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { colors, typography, spacing, globalStyles, gradientColors } from "../constants/styles";
import { Button, Card } from '@rneui/themed';
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

export default function Settings() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <LinearGradient
          colors={gradientColors}
          style={globalStyles.gradientBackground}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
                <Button
                  icon={<Ionicons name="close-outline" size={24} color={colors.white} />}
                  type="clear"
                  onPress={() => router.push("/Home")}
                />
              </View>

              <Button
                title="Account Details"
                icon={<Ionicons name="person-outline" size={24} color={colors.primary} style={styles.buttonIcon} />}
                buttonStyle={styles.accountButton}
                titleStyle={styles.accountButtonText}
                onPress={() => router.push("/AccountDetails")}
              />

              <Card containerStyle={styles.card}>
                <Card.Title style={styles.cardTitle}>
                  <Ionicons name="briefcase-outline" size={24} color={colors.primary} style={styles.cardIcon} />
                  Adjust Professional Personality
                </Card.Title>
                <Card.Divider />
                <Text style={styles.cardText}>Customize your AI's professional tone and style.</Text>
                <Button
                  title="Customize"
                  buttonStyle={styles.button}
                  titleStyle={styles.buttonText}
                />
              </Card>

              <Card containerStyle={styles.card}>
                <Card.Title style={styles.cardTitle}>
                  <Ionicons name="chatbubbles-outline" size={24} color={colors.primary} style={styles.cardIcon} />
                  Adjust Casual Personality
                </Card.Title>
                <Card.Divider />
                <Text style={styles.cardText}>Customize your AI's casual tone and style.</Text>
                <Button
                  title="Customize"
                  buttonStyle={styles.button}
                  titleStyle={styles.buttonText}
                />
              </Card>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.l,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.s,
  },
  title: {
    ...typography.h1,
    color: colors.white,
  },
  accountButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    marginHorizontal: spacing.m,
    marginBottom: spacing.m,
    paddingVertical: spacing.m,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  accountButtonText: {
    ...typography.h2,
    color: colors.primary,
    marginLeft: spacing.s,
  },
  buttonIcon: {
    marginRight: spacing.s,
  },
  card: {
    borderRadius: 15,
    marginHorizontal: spacing.m,
    marginBottom: spacing.m,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  cardTitle: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: spacing.s,
  },
  cardText: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.m,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.s,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
});