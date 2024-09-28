import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { Stack } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles, gradientColors, colors, typography, spacing } from "../constants/styles";
import { Button } from '@rneui/themed';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AccountDetails() {
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
                <Button
                  icon={<Ionicons name="arrow-back" size={24} color={colors.white} />}
                  type="clear"
                  onPress={() => router.push("/Settings" as any)}
                />
                <Text style={styles.title}>Account Details</Text>
                <View style={{ width: 40 }} />
              </View>
              
              <View style={styles.content}>
                <Text style={styles.placeholder}>Account Details Placeholder</Text>
                <Text style={styles.description}>This is where account information and settings will be displayed.</Text>
              </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.l,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
  },
  title: {
    ...typography.h1,
    color: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
  },
  placeholder: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.m,
  },
  description: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
  },
});