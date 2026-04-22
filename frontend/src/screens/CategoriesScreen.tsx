/**
 * Pantalla de Categorías
 * Muestra todas las categorías de fútbol
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
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/styles/theme';
import { categoriesService } from '@/services/api';
import { CATEGORIES_ARRAY } from '@/constants/categories';

export function CategoriesScreen({ navigation }: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesService.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback a categorías locales
      setCategories(CATEGORIES_ARRAY);
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: item.color }]}
      onPress={() =>
        navigation.navigate('CategoryDetails', { categoryId: item.id })
      }
    >
      <View style={styles.colorBox} style={{ backgroundColor: item.color }} />
      <View style={styles.cardContent}>
        <Text style={styles.categoryName}>{item.label}</Text>
        <Text style={styles.categoryAge}>{item.ageRange}</Text>
        <Text style={styles.categoryTeams}>{item._count?.teams || 30} equipos</Text>
      </View>
    </TouchableOpacity>
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
        data={categories}
        renderItem={renderCategory}
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
  listContent: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderLeftWidth: 4,
    alignItems: 'center',
    gap: SPACING.md,
  },
  colorBox: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
  },
  cardContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold as any,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  categoryAge: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  categoryTeams: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.tertiary,
  },
});
