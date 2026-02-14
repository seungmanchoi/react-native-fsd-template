import { Text, TextStyle, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { Colors, Typography as TypographyConfig } from '@shared/config';

type TTypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';

interface ITypographyProps {
  children: ReactNode;
  variant?: TTypographyVariant;
  color?: string;
  style?: TextStyle;
}

export function AppText({
  children,
  variant = 'body',
  color,
  style,
}: ITypographyProps): React.JSX.Element {
  return <Text style={[styles[variant], color ? { color } : null, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  h1: {
    fontSize: TypographyConfig.fontSizes['3xl'],
    fontWeight: TypographyConfig.fontWeights.bold,
    color: Colors.text.primary,
    lineHeight: TypographyConfig.fontSizes['3xl'] * TypographyConfig.lineHeights.tight,
  },
  h2: {
    fontSize: TypographyConfig.fontSizes['2xl'],
    fontWeight: TypographyConfig.fontWeights.bold,
    color: Colors.text.primary,
    lineHeight: TypographyConfig.fontSizes['2xl'] * TypographyConfig.lineHeights.tight,
  },
  h3: {
    fontSize: TypographyConfig.fontSizes.xl,
    fontWeight: TypographyConfig.fontWeights.semibold,
    color: Colors.text.primary,
    lineHeight: TypographyConfig.fontSizes.xl * TypographyConfig.lineHeights.tight,
  },
  body: {
    fontSize: TypographyConfig.fontSizes.base,
    fontWeight: TypographyConfig.fontWeights.normal,
    color: Colors.text.primary,
    lineHeight: TypographyConfig.fontSizes.base * TypographyConfig.lineHeights.normal,
  },
  caption: {
    fontSize: TypographyConfig.fontSizes.sm,
    fontWeight: TypographyConfig.fontWeights.normal,
    color: Colors.text.secondary,
    lineHeight: TypographyConfig.fontSizes.sm * TypographyConfig.lineHeights.normal,
  },
  label: {
    fontSize: TypographyConfig.fontSizes.sm,
    fontWeight: TypographyConfig.fontWeights.medium,
    color: Colors.text.tertiary,
    lineHeight: TypographyConfig.fontSizes.sm * TypographyConfig.lineHeights.normal,
  },
});
