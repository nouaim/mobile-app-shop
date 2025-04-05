import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

interface CategorySelectorProps {
  categories: string[];
  currentCategory?: string;
}

export function CategorySelector({ categories, currentCategory }: CategorySelectorProps) {
  return (
    <View style={styles.container}>
      <Link href="/" asChild>
        <Pressable style={[styles.categoryItem, !currentCategory && styles.activeCategory]}>
          <Text style={[styles.categoryText, !currentCategory && styles.activeCategoryText]}>
            All
          </Text>
        </Pressable>
      </Link>
      
      {categories.map((category) => (
        <Link href={`/category/${category}`} key={category} asChild>
          <Pressable style={[styles.categoryItem, currentCategory === category && styles.activeCategory]}>
            <Text style={[styles.categoryText, currentCategory === category && styles.activeCategoryText]}>
              {category}
            </Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeCategory: {
    backgroundColor: '#2f95dc',
    borderColor: '#2f95dc',
  },
  categoryText: {
    textTransform: 'capitalize',
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});