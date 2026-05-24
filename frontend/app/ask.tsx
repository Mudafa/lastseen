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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BackButton from '@/components/BackButton';

type Box = { x: number; y: number; w: number; h: number };
type Message = { id: string; from: 'user' | 'bot'; text: string; imageUrl?: string; box?: Box };

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
      setMessages((m) => [...m, { id: replyId, from: 'bot', text: demo.text, imageUrl: demo.imageUrl, box: demo.box }]);
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
    // demo image (public Unsplash image)
    const deskImage = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=demo';
    if (s.includes('calculator'))
      return {
        text: 'You last had your calculator on the desk next to the monitor.',
        imageUrl: deskImage,
        box: { x: 60, y: 50, w: 12, h: 10 },
      };
    if (s.includes('keys'))
      return {
        text: 'Your keys were last seen on the hallway table near the door.',
        imageUrl: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=demo',
        box: { x: 28, y: 65, w: 10, h: 8 },
      };
    if (s.includes('notebook'))
      return {
        text: 'The notebook was last seen on the bookshelf in the study.',
        imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=demo',
        box: { x: 42, y: 30, w: 14, h: 12 },
      };
    return { text: 'I would search recent scans and tell you where the item was last seen.' };
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
              <View style={styles.messageContent}>
                <View style={[styles.bubble, m.from === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                  <Text style={[styles.messageText, m.from === 'user' ? styles.messageTextUser : styles.messageTextBot]}>{m.text}</Text>
                </View>

                {m.imageUrl ? (
                  <View style={styles.imageCard}>
                    <Image source={{ uri: m.imageUrl }} style={styles.image} resizeMode="cover" />
                    {m.box ? (
                      <View
                        pointerEvents="none"
                        style={[
                          styles.overlayBox,
                          {
                            left: `${m.box.x}%`,
                            top: `${m.box.y}%`,
                            width: `${m.box.w}%`,
                            height: `${m.box.h}%`,
                            borderRadius: Math.max(m.box.w, m.box.h) / 2,
                          },
                        ]}
                      />
                    ) : null}
                  </View>
                ) : null}
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
  messageContent: { flexDirection: 'column', maxWidth: '80%' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 12 },
  bubbleUser: { backgroundColor: '#F59E0B', borderBottomRightRadius: 4 },
  bubbleBot: { backgroundColor: 'rgba(255,255,255,0.04)', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 14 },
  messageTextUser: { color: '#0F172A' },
  messageTextBot: { color: '#E6F0FF' },
  imageCard: { marginTop: 8, width: '100%', height: 180, borderRadius: 12, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  overlayBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245,158,11,0.08)',
  },
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
