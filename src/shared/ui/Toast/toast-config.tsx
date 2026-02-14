import { View, Text, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast, BaseToastProps } from 'react-native-toast-message';
import { Colors, Typography, Spacing } from '@shared/config';

export const toastConfig = {
  success: (props: BaseToastProps): React.JSX.Element => (
    <BaseToast
      {...props}
      style={[styles.base, styles.success]}
      contentContainerStyle={styles.content}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  error: (props: BaseToastProps): React.JSX.Element => (
    <ErrorToast
      {...props}
      style={[styles.base, styles.error]}
      contentContainerStyle={styles.content}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  info: ({ text1, text2 }: { text1?: string; text2?: string }): React.JSX.Element => (
    <View style={[styles.base, styles.info, styles.custom]}>
      {text1 && <Text style={styles.text1}>{text1}</Text>}
      {text2 && <Text style={styles.text2}>{text2}</Text>}
    </View>
  ),
};

const styles = StyleSheet.create({
  base: {
    borderLeftWidth: 4,
    borderRadius: 8,
    backgroundColor: Colors.background.secondary,
  },
  success: {
    borderLeftColor: Colors.status.success,
  },
  error: {
    borderLeftColor: Colors.status.error,
  },
  info: {
    borderLeftColor: Colors.status.info,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  custom: {
    padding: Spacing.lg,
    minHeight: 60,
  },
  text1: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.text.primary,
  },
  text2: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.text.secondary,
  },
});
