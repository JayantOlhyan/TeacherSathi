import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card, Button, EmptyState } from '../../components';
import { theme } from '../../constants/theme';
import { notificationService } from '../../services';
import { MobileNotificationItem } from '../../types';

export const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<MobileNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    const data = await notificationService.fetchNotifications();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    await loadNotifications();
  };

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    await loadNotifications();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>
              {unreadCount > 0 ? `${unreadCount} unread announcements` : 'All caught up'}
            </Text>
          </View>
          {unreadCount > 0 && (
            <Button
              onPress={handleMarkAllAsRead}
              size="md"
              title="Mark All Read"
              variant="outline"
            />
          )}
        </View>

        {notifications.length === 0 ? (
          <EmptyState
            description="You don't have any notifications right now."
            title="No Notifications"
          />
        ) : (
          notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => handleMarkAsRead(item.id)}
            >
              <Card
                style={[
                  styles.notificationCard,
                  !item.is_read ? styles.unreadCard : styles.readCard,
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.itemType}>{item.type}</Text>
                  <Text style={styles.itemDate}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemBody}>{item.body}</Text>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface.background,
  },
  container: {
    padding: theme.spacing[4],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  title: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[900],
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral[600],
    marginTop: 2,
  },
  notificationCard: {
    padding: theme.spacing[3],
    marginBottom: theme.spacing[3],
  },
  unreadCard: {
    borderColor: theme.colors.primary[600],
    borderWidth: 1.5,
    backgroundColor: '#F0FDF4',
  },
  readCard: {
    borderColor: theme.colors.surface.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  itemType: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.primary[700],
  },
  itemDate: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.neutral[500],
  },
  itemTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[900],
    marginBottom: 4,
  },
  itemBody: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral[700],
    lineHeight: 18,
  },
});
