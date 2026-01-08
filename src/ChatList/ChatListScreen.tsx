import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../components/Header/Header';
import { useNavigation } from '@react-navigation/native';

interface Chat {
    id: number;
    other_user: {
        id: number;
        username: string;
        profile_picture: string | null;
    };
    last_message: { content: string } | string | null;
    last_message_time: string;
    unread_count: number;
    last_message_sender_id?: number;
}

export default function ChatListScreen() {
    const { token: authToken } = useAuth();
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();

    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const fetchMe = async () => {
        try {
            const res = await fetch('https://bkapp-mp8l.onrender.com/api/me/', {
                headers: { Authorization: `Token ${authToken}` },
            });
            const data = await res.json();
            setCurrentUserId(data.id);
        } catch (err) { }
    };

    const fetchChats = async () => {
        if (!authToken) return;
        try {
            const response = await fetch('https://bkapp-mp8l.onrender.com/chats', {
                headers: { Authorization: `Token ${authToken}` },
            });
            const data = await response.json();
            setChats(data || []);
        } catch (err) {
            console.log('Error fetching chats');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchMe();
            fetchChats();
        }
    }, [authToken]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchChats();
    }, []);

    const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        const date = new Date(timeStr);
        const now = new Date();
        const diffHrs = (now.getTime() - date.getTime()) / 3600000;
        if (diffHrs < 24) {
            return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    };

    const renderChat = ({ item }: { item: Chat }) => {
        const lastMsg = typeof item.last_message === 'object' ? item.last_message?.content : item.last_message;
        const isMe = item.last_message_sender_id === currentUserId;
        const isUnread = item.unread_count > 0 && !isMe;

        return (
            <TouchableOpacity
                style={styles.chatCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ChatDetail', { chatId: item.id })}
            >
                <View style={styles.avatarWrapper}>
                    <Image
                        source={{ uri: item.other_user.profile_picture || 'https://i.imgur.com/ZcLLrkY.png' }}
                        style={styles.avatar}
                    />
                    {isUnread && <View style={styles.unreadBadgeIndicator} />}
                </View>

                <View style={styles.chatInfo}>
                    <View style={styles.infoTop}>
                        <Text style={[styles.username, isUnread && styles.boldText]} numberOfLines={1}>
                            {item.other_user.username}
                        </Text>
                        <Text style={[styles.timeText, isUnread && styles.unreadTime]}>
                            {formatTime(item.last_message_time)}
                        </Text>
                    </View>

                    <View style={styles.infoBottom}>
                        <Text style={[styles.lastMessage, isUnread && styles.unreadMessageText]} numberOfLines={1}>
                            {isMe ? `Bạn: ${lastMsg}` : lastMsg || 'Bắt đầu trò chuyện'}
                        </Text>
                        {isUnread && (
                            <View style={styles.unreadCountBadge}>
                                <Text style={styles.unreadCountText}>{item.unread_count}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
            {/* CLEAN HEADER */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.navbarTitle}>Tin nhắn</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 50 }} color="#000" />
            ) : (
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderChat}
                    contentContainerStyle={styles.listPadding}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Ionicons name="chatbubble-ellipses-outline" size={64} color="#E0E0E0" />
                            <Text style={styles.emptyText}>Hộp thư đang trống</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },

    // Header
    navbar: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    backBtn: { padding: 8 },
    navbarTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', letterSpacing: -0.5 },

    // List & Cards
    listPadding: { paddingHorizontal: 16, paddingBottom: 30 },
    chatCard: {
        flexDirection: 'row',
        paddingVertical: 14,
        alignItems: 'center',
    },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F5F5F5' },
    unreadBadgeIndicator: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#007AFF',
        borderWidth: 2,
        borderColor: '#FFF',
    },

    chatInfo: { flex: 1, marginLeft: 16 },
    infoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    username: { fontSize: 17, fontWeight: '600', color: '#1A1A1A' },
    timeText: { fontSize: 13, color: '#999' },

    infoBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    lastMessage: { fontSize: 14, color: '#666', flex: 1, marginRight: 8 },

    // Unread Styles
    boldText: { fontWeight: '800' },
    unreadMessageText: { color: '#000', fontWeight: '600' },
    unreadTime: { color: '#007AFF', fontWeight: '700' },
    unreadCountBadge: {
        backgroundColor: '#007AFF',
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadCountText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },

    // Utils
    separator: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 72 },
    emptyBox: { alignItems: 'center', marginTop: 150 },
    emptyText: { marginTop: 12, color: '#999', fontSize: 16 },
});