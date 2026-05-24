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
import BackButton from '@/components/BackButton';

type Message = { id: string; from: 'user' | 'bot'; text: string };

export default function AskScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<ScrollView | null>(null);

  const sampleQuestions = [
    'Where is my calculator?',
    'Where did I leave my keys?',
    'When did I last see my notebook?',
  ];

  useEffect(() => {
    // welcome message
    setMessages([
      { id: 'm-0', from: 'bot', text: 'Try a sample question or type your own — e.g. "Where is my calculator?"' },
    ]);
  }, []);

  const sendMessage = (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: `${Date.now()}-u`, from: 'user', text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setText('');

    // placeholder bot reply (replace with backend call later)
    const replyId = `${Date.now()}-b`;
    const demo = generateDemoReply(trimmed);
    setTimeout(() => {
      setMessages((m) => [...m, { id: replyId, from: 'bot', text: demo }]);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 700);
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const send = () => sendMessage(text);

  const onClickSample = (q: string) => {
    // send immediately when sample is clicked
    sendMessage(q);
  };

  function generateDemoReply(q: string) {
    const s = q.toLowerCase();
    if (s.includes('calculator')) return "Example answer: You last had your calculator on the desk next to the monitor.";
    if (s.includes('keys')) return "Example answer: Your keys were last seen on the hallway table near the door.";
    if (s.includes('notebook')) return "Example answer: The notebook was last seen on the bookshelf in the study.";
    return "Example answer: I would search recent scans and tell you where the item was last seen.";
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.replace('/')} />
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

        {/* Chips overlay positioned above the input */}
        <View style={styles.chipsOverlay} pointerEvents="box-none">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsOverlayRow}>
            {sampleQuestions.map((q) => (
              <Pressable key={q} onPress={() => onClickSample(q)} style={({ pressed }) => [styles.chipSmall, pressed && styles.chipPressedSmall]}>
                <Text style={styles.chipTextSmall}>{q}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

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
  chipsOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 74,
    height: 40,
    zIndex: 20,
  },
  chipsOverlayRow: { alignItems: 'center', paddingLeft: 4, paddingRight: 8, gap: 8 },
  chipSmall: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 30,
  },
  chipPressedSmall: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ scale: 0.985 }],
  },
  chipTextSmall: { color: '#E6F0FF', fontSize: 12, fontWeight: '600' },
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
