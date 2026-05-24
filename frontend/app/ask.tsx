import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackButton from '@/components/BackButton';
import { askQuestion } from '@/lib/api';
import { colors } from '@/constants/theme';

type Message = {
  id: string;
  from: 'user' | 'bot';
  text: string;
  imageUrl?: string;
};

function formatAskReply(answer: Awaited<ReturnType<typeof askQuestion>>): string {
  if (answer.location) {
    const confidence =
      answer.confidence != null ? ` (${Math.round(answer.confidence * 100)}% confident)` : '';
    return `Your ${answer.object} was last seen ${answer.location}.${confidence}`;
  }
  return answer.message ?? `No location found for "${answer.object}".`;
}

export default function AskScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

  const sampleQuestions = [
    'Where is my calculator?',
    'Where did I leave my keys?',
    'Where is my notebook?',
  ];

  useEffect(() => {
    setMessages([
      {
        id: 'm-0',
        from: 'bot',
        text: 'Ask where something is. Use the camera first so I have events to search.',
      },
    ]);
  }, []);

  const sendMessage = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: `${Date.now()}-u`, from: 'user', text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setText('');
    setLoading(true);
    scrollRef.current?.scrollToEnd({ animated: true });

    const replyId = `${Date.now()}-b`;
    try {
      const answer = await askQuestion(trimmed);
      setMessages((m) => [
        ...m,
        {
          id: replyId,
          from: 'bot',
          text: formatAskReply(answer),
          imageUrl: answer.image_url ?? undefined,
        },
      ]);
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Could not reach the server.';
      setMessages((m) => [
        ...m,
        {
          id: replyId,
          from: 'bot',
          text: `Error: ${detail}. Check that the backend is running and EXPO_PUBLIC_API_URL is set.`,
        },
      ]);
    } finally {
      setLoading(false);
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  };

  const send = () => void sendMessage(text);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text style={styles.title}>Ask</Text>
        {loading ? <ActivityIndicator size="small" color={colors.accent} /> : <View style={styles.headerSpacer} />}
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}>
          {messages.map((m) => (
            <View
              key={m.id}
              style={[styles.messageRow, m.from === 'user' ? styles.messageRowUser : styles.messageRowBot]}>
              <View style={styles.messageContent}>
                <View style={[styles.bubble, m.from === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                      <Text
                        style={[
                          styles.messageText,
                          m.from === 'user' ? styles.messageTextUser : styles.messageTextBot,
                        ]}>
                        {m.text}
                      </Text>
                </View>
                {m.imageUrl ? (
                  <View style={styles.imageCard}>
                    <Image source={{ uri: m.imageUrl }} style={styles.image} resizeMode="cover" />
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.chipsOverlay} pointerEvents="box-none">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsOverlayRow}>
            {sampleQuestions.map((q) => (
              <Pressable
                key={q}
                disabled={loading}
                onPress={() => void sendMessage(q)}
                style={({ pressed }) => [styles.chipSmall, pressed && styles.chipPressedSmall]}>
                <Text style={styles.chipTextSmall}>{q}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Ask where something is..."
            placeholderTextColor={colors.textMuted}
            value={text}
            onChangeText={setText}
            style={styles.input}
            onSubmitEditing={send}
            returnKeyType="send"
            editable={!loading}
          />
          <Pressable onPress={send} style={styles.sendButton} disabled={loading}>
            <Ionicons name="send" size={18} color={colors.backgroundDeep} />
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
  headerSpacer: { width: 24 },
  title: { fontSize: 18, fontWeight: '700', color: colors.textLight, flex: 1 },
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 8 },
  chipsOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 80,
    height: 28,
    zIndex: 20,
  },
  chipsOverlayRow: { alignItems: 'center', paddingLeft: 4, paddingRight: 8, gap: 6 },
  chipSmall: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    marginRight: 8,
    minHeight: 24,
    justifyContent: 'center',
  },
  chipPressedSmall: { opacity: 0.9 },
  chipTextSmall: { color: colors.textLight, fontSize: 12, fontWeight: '600' },
  messages: { paddingVertical: 12, gap: 8, paddingBottom: 96 },
  messageRow: { flexDirection: 'row' },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowBot: { justifyContent: 'flex-start' },
  messageContent: { flexDirection: 'column', maxWidth: '80%' },
  bubble: { maxWidth: '80%', padding: 10, borderRadius: 10 },
  bubbleUser: { backgroundColor: colors.buttonPrimaryBg, borderBottomRightRadius: 6 },
  bubbleBot: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderBottomLeftRadius: 6,
  },
  messageText: { fontSize: 14, lineHeight: 20 },
  messageTextUser: { color: colors.textLight },
  messageTextBot: { color: colors.textLight },
  imageCard: { marginTop: 8, width: '100%', height: 200, borderRadius: 10, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    color: colors.textLight,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
});
