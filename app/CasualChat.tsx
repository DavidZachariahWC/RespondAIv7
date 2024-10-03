import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  user: 'user' | 'ai';
}

export default function CasualChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: 'Hello! How can I assist you today?',
        user: 'ai',
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      user: 'user',
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputText('');

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newUserMessage.text }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.choices[0].message.content,
        user: 'ai',
      };

      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        user: 'ai',
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageBubble, item.user === 'user' ? styles.userBubble : styles.aiBubble]}>
      <Text style={[styles.messageText, item.user === 'user' ? styles.userText : styles.aiText]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Casual Chat',
          headerTitleStyle: styles.headerText,
          headerStyle: styles.header,
          headerTintColor: '#FFFFFF',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 84}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#A0AEC0"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    backgroundColor: '#4A5568',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#4299E1',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2E8F0',
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#2D3748',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#EDF2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 12,
    color: '#2D3748',
  },
  sendButton: {
    backgroundColor: '#4299E1',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});