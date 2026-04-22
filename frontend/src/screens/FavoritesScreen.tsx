/**
 * Pantalla de Favoritos
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/styles/theme';
import { teamsService, usersService } from '@/services/api';
import { useAppStore } from '@/stores/appStore';

export function FavoritesScreen({ navigation }: any) {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { favoriteTeams, userId, removeFavorite } = useAppStore();

  useEffect(() => {
    fetchFavoriteTeams();
  }, [favoriteTeams]);

  const fetchFavoriteTeams = async () => {
    try {
      setLoading(true);
      if (favoriteTeams.length === 0) {
        setTeams([]);
        return;
      }

      // Obtener todos los equipos y filtrar los favoritos
      const response = await usersService.getFavorites(userId);
      if (response.success) {
        setTeams(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (teamId: string) => {
    removeFavorite(teamId);
    usersService.removeFavorite(teamId, userId).catch(console.error);
  };

  const renderTeam = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('TeamDetails', { teamId: item.id })
      }
    >
      <View style={styles.cardContent}>
        <Text style={styles.teamName}>{item.name}</Text>
        <Text style={styles.teamTown}>{item.town}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <MaterialIcons name="close" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (teams.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="favorite-border" size={60} color={COLORS.text.tertiary} />
        <Text style={styles.emptyText}>No hay equipos favoritos</Text>
        <Text style={styles.emptySubtext}>Agrega equipos a favoritos para seguir sus partidos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={teams}
        renderItem={renderTeam}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
  },
  teamName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold as any,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  teamTown: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  removeButton: {
    padding: SPACING.sm,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold as any,
    color: COLORS.text.primary,
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
});
