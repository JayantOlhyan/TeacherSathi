import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { networkMonitor } from './src/sync/networkMonitor';
import { syncEngine } from './src/sync/syncEngine';

export default function App() {
  useEffect(() => {
    // Start network connectivity observation
    const unsubscribe = networkMonitor.subscribe((state) => {
      if (state.status === 'ONLINE') {
        // Automatically attempt outbox sync when connection is restored
        syncEngine.processOutbox().catch(() => {});
      }
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <RootNavigator />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
