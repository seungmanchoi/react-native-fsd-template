import { View, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { Colors, BorderRadius, Spacing, Shadows } from '@shared/config';

interface ICardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'glass';
}

export function Card({ children, style, variant = 'default' }: ICardProps): React.JSX.Element {
  return (
    <View style={[styles.base, variant === 'glass' ? styles.glass : styles.default, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  default: {
    backgroundColor: Colors.background.secondary,
    ...Shadows.sm,
  },
  glass: {
    backgroundColor: Colors.surface.card,
    borderWidth: 1,
    borderColor: Colors.surface.glassBorder,
    ...Shadows.md,
  },
});
