/**
 * Pantalla de Detalles de Equipo
 * Muestra partidos de un equipo
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/styles/theme';
import { matchesService } from '@/services/api';

export function TeamDetailsScreen({ route }: any) {
  const { teamId } = route.params;
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [teamId]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await matchesService.getByTeam(teamId);
      if (response.success) {
        setMatches(response.data);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMatch = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.matchHeader}>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString('es-HN')}
        </Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {getStatusLabel(item.status)}
        </Text>
      </View>

      <View style={styles.matchContent}>
        <View style={styles.teamColumn}>
          <Text style={styles.teamName}>{item.homeTeam?.name}</Text>
        </View>

        <View style={styles.scoreColumn}>
          {item.status === 'finished' ? (
            <Text style={styles.score}>
              {item.homeScore} - {item.awayScore}
            </Text>
          ) : (
            <Text style={styles.vsText}>VS</Text>
          )}
        </View>

        <View style={styles.teamColumn}>
          <Text style={[styles.teamName, { textAlign: 'right' }]}>
            {item.awayTeam?.name}
          </Text>
        </View>
      </View>

      <Text style={styles.location}>{item.location}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    scheduled: 'Programado',
    live: 'En vivo',
    finished: 'Finalizado',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    scheduled: COLORS.info,
    live: COLORS.error,
    finished: COLORS.success,
    cancelled: COLORS.warning,
  };
  return colors[status] || COLORS.text.secondary;
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
  listContent: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  date: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  status: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold as any,
  },
  matchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  teamColumn: {
    flex: 1,
  },
  scoreColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.md,
  },
  teamName: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold as any,
    color: COLORS.text.primary,
  },
  score: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold as any,
    color: COLORS.primary,
  },
  vsText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium as any,
    color: COLORS.text.tertiary,
  },
  location: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
