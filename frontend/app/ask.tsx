import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Message = { id: string; from: 'user' | 'bot'; text: string };

export default function AskScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    // welcome message
    setMessages([{ id: 'm-0', from: 'bot', text: 'Ask me where something is — e.g. "Where is my calculator?"' }]);
  }, []);

  const send = () => {
    if (!text.trim()) return;
    const userMsg: Message = { id: `${Date.now()}-u`, from: 'user', text: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setText('');

    // placeholder bot reply (replace with backend call later)
    const replyId = `${Date.now()}-b`;
    setTimeout(() => {
      setMessages((m) => [...m, { id: replyId, from: 'bot', text: 'Demo response: backend not connected yet.' }]);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 700);
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#E6F0FF" />
        </Pressable>
        <Text style={styles.title}>Ask</Text>
      </View>

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
          {messages.map((m) => (
            <View key={m.id} style={[styles.messageRow, m.from === 'user' ? styles.messageRowUser : styles.messageRowBot]}>
              <View style={[styles.bubble, m.from === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                <Text style={[styles.messageText, m.from === 'user' ? styles.messageTextUser : styles.messageTextBot]}>{m.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Ask where something is..."
            placeholderTextColor="#94A3B8"
            value={text}
            onChangeText={setText}
            style={styles.input}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <Pressable onPress={send} style={styles.sendButton}>
            <Ionicons name="send" size={18} color="#0F172A" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  header: {
    height: 64,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#E6F0FF' },
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 8 },
  messages: { paddingVertical: 12, gap: 12 },
  messageRow: { flexDirection: 'row' },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowBot: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 12 },
  bubbleUser: { backgroundColor: '#F59E0B', borderBottomRightRadius: 4 },
  bubbleBot: { backgroundColor: 'rgba(255,255,255,0.04)', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 14 },
  messageTextUser: { color: '#0F172A' },
  messageTextBot: { color: '#E6F0FF' },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    color: '#E6F0FF',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sendButton: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F59E0B' },
});
