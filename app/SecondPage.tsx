import { Text, View, Button } from "react-native";
import { useRouter } from "expo-router";

export default function SecondPage() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is the Second Page</Text>
      <Text>Here's some example text for you!</Text>
      <Button
        title="Go back to Homepage"
        onPress={() => router.push("/Home")}
      />
    </View>
  );
}