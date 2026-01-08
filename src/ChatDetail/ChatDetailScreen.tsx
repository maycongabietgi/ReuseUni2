import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    Image,
    Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import useAuth from '../components/Header/Header';

interface Message {
    id: number;
    sender: number;
    content: string;
    created_at: string;
}

export default function ChatDetailScreen() {
    const { token } = useAuth();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { chatId } = route.params;

    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    /* ================== TỰ ĐỘNG CUỘN XUỐNG (KEYBOARD) ================== */
    useEffect(() => {
        // Trên Android, sự kiện này kích hoạt khi bàn phím đã hiện xong
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            flatListRef.current?.scrollToEnd({ animated: true });
        });

        return () => showSubscription.remove();
    }, []);

    const scrollToBottom = (animated = true) => {
        if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated });
        }
    };

    /* ================== ẨN TAB BAR ================== */
    useFocusEffect(
        useCallback(() => {
            const parent = navigation.getParent();
            parent?.setOptions({ tabBarStyle: { display: 'none' } });
            return () => {
                parent?.setOptions({ tabBarStyle: undefined });
            };
        }, [navigation])
    );

    /* ================== API CALLS ================== */
    useEffect(() => {
        const fetchMe = async () => {
            if (!token) return;
            try {
                const res = await fetch('https://bkapp-mp8l.onrender.com/api/me/', {
                    headers: { Authorization: `Token ${token}` },
                });
                const data = await res.json();
                setCurrentUserId(data.id);
            } catch { }
        };
        fetchMe();
    }, [token]);

    const fetchMessages = useCallback(async () => {
        if (!token || !chatId) return;
        try {
            const res = await fetch(
                `https://bkapp-mp8l.onrender.com/chats/${chatId}/messages`,
                { headers: { Authorization: `Token ${token}` } }
            );
            const data = await res.json();
            setMessages(data || []);
            setLoading(false);
        } catch {
            setLoading(false);
        }
    }, [token, chatId]);

    useFocusEffect(
        useCallback(() => {
            fetchMessages();
            const interval = setInterval(fetchMessages, 15000);
            return () => clearInterval(interval);
        }, [fetchMessages])
    );

    /* ================== GỬI TIN NHẮN ================== */
    const sendMessage = async () => {
        if (!newMessage.trim() || !token) return;

        const tempId = Date.now();
        const contentToSend = newMessage.trim();
        const tempMsg: Message = {
            id: tempId,
            sender: currentUserId!,
            content: contentToSend,
            created_at: new Date().toISOString(),
        };

        setMessages(prev => [...prev, tempMsg]);
        setNewMessage('');

        // Cuộn ngay lập tức khi nhấn gửi
        setTimeout(() => scrollToBottom(), 50);

        try {
            const res = await fetch(
                `https://bkapp-mp8l.onrender.com/chats/${chatId}/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                    body: JSON.stringify({ content: contentToSend }),
                }
            );
            const realMsg = await res.json();
            setMessages(prev =>
                prev.map(m => (m.id === tempId ? realMsg : m))
            );
        } catch {
            Alert.alert('Lỗi', 'Không gửi được tin nhắn');
        }
    };

    /* ================== RENDER COMPONENT ================== */
    const renderItem = ({ item }: { item: Message }) => {
        const isMe = item.sender === currentUserId;
        return (
            <View style={[styles.row, isMe ? styles.rowRight : styles.rowLeft]}>
                {!isMe && (
                    <Image
                        source={{ uri: 'https://i.imgur.com/ZcLLrkY.png' }}
                        style={styles.avatar}
                    />
                )}
                <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
                    <Text style={[styles.text, isMe && { color: '#fff' }]}>
                        {item.content}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0084ff" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Chat</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* DANH SÁCH TIN NHẮN */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={i => i.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                // Tự động cuộn khi layout co lại do bàn phím
                onContentSizeChange={() => scrollToBottom()}
                // Quan trọng: giúp Android không bị giật khi thêm tin nhắn mới
                maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
            />

            {/* Ô NHẬP LIỆU */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={[styles.inputWrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
                    <TextInput
                        style={styles.input}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Tin nhắn..."
                        multiline
                        textAlignVertical="center"
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        style={styles.sendButton}
                        disabled={!newMessage.trim()}
                    >
                        <Ionicons
                            name="send"
                            size={24}
                            color={newMessage.trim() ? '#2D7FF9' : '#ccc'}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        elevation: 4, // Đổ bóng cho Android
        borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
        borderBottomColor: '#ddd',
    },
    backButton: { padding: 8 },
    title: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 18 },

    listContent: { paddingVertical: 16, paddingHorizontal: 8 },
    row: { flexDirection: 'row', marginVertical: 4, alignItems: 'flex-end' },
    rowLeft: { justifyContent: 'flex-start' },
    rowRight: { justifyContent: 'flex-end' },

    avatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8, marginBottom: 2 },

    bubble: {
        maxWidth: '75%',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
    },
    myBubble: {
        backgroundColor: '#0084ff',
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
        borderWidth: 0.5,
        borderColor: '#ddd',
    },

    text: { fontSize: 16, color: '#000' },

    inputWrap: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    input: {
        flex: 1,
        backgroundColor: '#f1f3f4',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingTop: 8,
        paddingBottom: 8,
        marginRight: 8,
        marginBottom: 8,
        maxHeight: 120,
        fontSize: 16,
    },
    sendButton: {
        height: 45,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
});