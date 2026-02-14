import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '@shared/config';

type TButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type TButtonSize = 'sm' | 'md' | 'lg';

interface IButtonProps {
  title: string;
  onPress: () => void;
  variant?: TButtonVariant;
  size?: TButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
}: IButtonProps): React.JSX.Element {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary.DEFAULT : '#fff'}
        />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}`], styles[`text_${size}`]]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  primary: {
    backgroundColor: Colors.primary.DEFAULT,
  } as ViewStyle,
  secondary: {
    backgroundColor: Colors.background.tertiary,
  } as ViewStyle,
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.DEFAULT,
  } as ViewStyle,
  ghost: {
    backgroundColor: 'transparent',
  } as ViewStyle,
  size_sm: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 36,
  } as ViewStyle,
  size_md: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 44,
  } as ViewStyle,
  size_lg: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minHeight: 52,
  } as ViewStyle,
  fullWidth: {
    width: '100%',
  } as ViewStyle,
  disabled: {
    opacity: 0.5,
  } as ViewStyle,
  pressed: {
    opacity: 0.8,
  } as ViewStyle,
  text: {
    fontWeight: Typography.fontWeights.semibold,
  } as TextStyle,
  text_primary: {
    color: '#ffffff',
  } as TextStyle,
  text_secondary: {
    color: Colors.text.primary,
  } as TextStyle,
  text_outline: {
    color: Colors.primary.DEFAULT,
  } as TextStyle,
  text_ghost: {
    color: Colors.primary.DEFAULT,
  } as TextStyle,
  text_sm: {
    fontSize: Typography.fontSizes.sm,
  } as TextStyle,
  text_md: {
    fontSize: Typography.fontSizes.base,
  } as TextStyle,
  text_lg: {
    fontSize: Typography.fontSizes.lg,
  } as TextStyle,
});
