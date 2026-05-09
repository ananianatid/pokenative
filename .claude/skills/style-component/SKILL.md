---
name: Style Component
description: This skill should be used when the user wants to "style a component", "create component styles", "add styling to a view", "generate stylesheets", "apply theme colors", "create a styled component", or needs to create properly-typed StyleSheet constants following project conventions.
version: 0.1.0
---

# Style Component Skill

This skill guides creating properly-typed, maintainable component styles following pokenative conventions.

## Core Principles

1. **StyleSheet First**: All styles in `const Styles = StyleSheet.create()` with `satisfies ViewStyle` (or `TextStyle` for text)
2. **No Inline Styles**: Never write styles directly in JSX `style={{ ... }}`
3. **Type Safety**: Use TypeScript satisfaction checking to catch style errors at compile time
4. **Theme Integration**: Access colors via `useThemeColors()` for dynamic theming
5. **Composition**: Apply styles as arrays `[baseStyle, dynamicStyle]` to allow override patterns
6. **Naming**: Use semantic names (container, header, badge, text) not descriptive ones (redBox, largeFont)

## StyleSheet Structure

```tsx
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface MyComponentProps {
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

// Define all styles in one constant
const Styles = StyleSheet.create({
  // ✅ ViewStyle for View containers
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  } satisfies ViewStyle,

  // ✅ TextStyle for Text content
  heading: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  } satisfies TextStyle,

  // ✅ Conditional styles as separate objects
  primaryVariant: {
    backgroundColor: '#FF0000',
  } satisfies ViewStyle,

  secondaryVariant: {
    backgroundColor: '#00FF00',
  } satisfies ViewStyle,
});

export const MyComponent = ({ variant = 'primary', style, ...rest }: MyComponentProps) => {
  // Use arrays to compose styles
  const variantStyle = variant === 'primary' ? Styles.primaryVariant : Styles.secondaryVariant;
  
  return (
    <View style={[Styles.container, variantStyle, style]} {...rest}>
      <Text style={Styles.heading}>Hello</Text>
    </View>
  );
};
```

## ViewStyle vs TextStyle

- **ViewStyle** (`View`, `Pressable`, `Card`, `Row`, containers)
  - `flex`, `width`, `height`, `padding`, `margin`, `backgroundColor`, `borderRadius`, `flexDirection`, `justifyContent`, `alignItems`
- **TextStyle** (`Text`, `ThemedText`)
  - `fontSize`, `fontWeight`, `lineHeight`, `color`, `textAlign`, `textTransform`, `letterSpacing`

```tsx
// ✅ CORRECT
const Styles = StyleSheet.create({
  viewContainer: { flex: 1, padding: 16 } satisfies ViewStyle,
  textLabel: { fontSize: 14, fontWeight: '600' } satisfies TextStyle,
});

// ❌ WRONG: Mixing TextStyle into ViewStyle
const BadStyles = StyleSheet.create({
  mixed: { flex: 1, fontSize: 14 } satisfies ViewStyle, // ← TextStyle property in ViewStyle!
});
```

## Dynamic Theming Patterns

### Pattern 1: Use Theme Colors in Component

```tsx
import { useThemeColors } from '@/hooks/useThemeColors';

export const Card = ({ style }: { style?: ViewStyle }) => {
  const colors = useThemeColors();

  const Styles = StyleSheet.create({
    container: {
      backgroundColor: colors.grayWhite,
      borderRadius: 12,
      padding: 16,
      ...Shadows.dp2,
    } satisfies ViewStyle,
  });

  return <View style={[Styles.container, style]} />;
};
```

### Pattern 2: Pokemon Type Color Styling

```tsx
import { Colors } from '@/constants/colors';

interface TypeBadgeProps {
  type: keyof typeof Colors.type;
}

export const TypeBadge = ({ type }: TypeBadgeProps) => {
  const Styles = StyleSheet.create({
    badge: {
      backgroundColor: Colors.type[type],
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignItems: 'center',
    } satisfies ViewStyle,
  });

  return <View style={Styles.badge} />;
};
```

### Pattern 3: Conditional Variants

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
}

const Styles = StyleSheet.create({
  base: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  } satisfies ViewStyle,
  primary: { backgroundColor: '#DC0A2D' } satisfies ViewStyle,
  secondary: { backgroundColor: '#EFEFEF' } satisfies ViewStyle,
  ghost: { backgroundColor: 'transparent' } satisfies ViewStyle,
});

export const Button = ({ variant, style }: ButtonProps & { style?: ViewStyle }) => {
  const variantStyle = Styles[variant];
  return <Pressable style={[Styles.base, variantStyle, style]} />;
};
```

## Spacing & Layout Primitives

Use consistent spacing scale (multiples of 4):

```tsx
const Styles = StyleSheet.create({
  spacingSmall: { padding: 4 } satisfies ViewStyle,     // 4px
  spacingBase: { padding: 8 } satisfies ViewStyle,      // 8px
  spacingMedium: { padding: 12 } satisfies ViewStyle,   // 12px
  spacingLarge: { padding: 16 } satisfies ViewStyle,    // 16px
  spacingXL: { padding: 24 } satisfies ViewStyle,       // 24px

  gapSmall: { gap: 4 } satisfies ViewStyle,
  gapBase: { gap: 8 } satisfies ViewStyle,
  gapMedium: { gap: 12 } satisfies ViewStyle,
  gapLarge: { gap: 16 } satisfies ViewStyle,
});

// Usage
<Row gap={12}>        {/* Use prop instead of Styles.gapMedium */}
  <View style={Styles.spacingLarge} />
</Row>
```

## Typography Styling

Always use `<ThemedText>` component; don't style raw `<Text>`:

```tsx
// ✅ CORRECT: Use ThemedText with variant
<ThemedText variant="headline" color="grayDark">
  Main Heading
</ThemedText>

// ❌ WRONG: Styling Text directly
<Text style={{ fontSize: 20, fontWeight: 'bold' }}>
  Wrong
</Text>

// ✅ If custom text styling needed, still use ThemedText
const Styles = StyleSheet.create({
  customText: {
    fontSize: 16,
    lineHeight: 24,
    textTransform: 'uppercase',
  } satisfies TextStyle,
});

<ThemedText style={Styles.customText}>Custom</ThemedText>
```

## Common Style Patterns

### Flex Layouts

```tsx
// Row (horizontal)
const Styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  } satisfies ViewStyle,
});

// Column (vertical, default)
const Styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  } satisfies ViewStyle,
});

// Centered
const Styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  } satisfies ViewStyle,
});

// Stretched full width with aspect ratio
const Styles = StyleSheet.create({
  aspectRatio: {
    width: '100%',
    aspectRatio: 1 / 1, // Square
  } satisfies ViewStyle,
});
```

### Cards & Elevation

```tsx
import { Shadows } from '@/constants/shadows';

const Styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    ...Shadows.dp2, // Spreads shadowOpacity, shadowColor, elevation, etc.
  } satisfies ViewStyle,
});
```

### Responsive Sizing

Use percentages or flex for responsive components:

```tsx
const Styles = StyleSheet.create({
  // Flexible width (grows to available space)
  flexItem: {
    flex: 1,
    minWidth: 0, // Important: allows text truncation in flex containers
  } satisfies ViewStyle,

  // Fixed width
  fixedWidth: {
    width: 100,
  } satisfies ViewStyle,

  // Percentage width
  halfWidth: {
    width: '50%',
  } satisfies ViewStyle,
});
```

## Anti-Patterns to Avoid

```tsx
// ❌ Inline styles in JSX
<View style={{ flex: 1, padding: 16 }} />

// ❌ Missing satisfies annotation
const Styles = StyleSheet.create({
  container: { flex: 1 }, // No type checking!
});

// ❌ Mixing ViewStyle and TextStyle
const Styles = StyleSheet.create({
  mixed: { flex: 1, fontSize: 16 } satisfies ViewStyle, // fontSize invalid for View
});

// ❌ Dynamic styles without composition
export const Component = ({ color }) => (
  <View style={{ backgroundColor: color }} /> // Can't be overridden!
);

// ✅ CORRECT: Allow override with array composition
export const Component = ({ color, style }: { color: string; style?: ViewStyle }) => (
  <View style={[{ backgroundColor: color }, style]} />
);
```

## Workflow

1. **Define Styles constant** at bottom of file with `satisfies ViewStyle` or `satisfies TextStyle`
2. **Add all component styles** to one `StyleSheet.create()` call
3. **Use semantic names**: `container`, `header`, `badge`, not `wrapper`, `box`, `red`
4. **Apply dynamic colors**: Call `useThemeColors()` for theme-aware colors
5. **Compose styles**: Use array `[base, dynamic, customOverride]` for maximum flexibility
6. **Export component** with `{style, ...rest}` pattern to accept style prop
7. **Document variants**: Add JSDoc comments for complex style compositions
8. **Test themes**: Verify light/dark theme switching if using theme colors

## Performance Tips

- StyleSheet.create() is optimized; always use it instead of inline objects
- Avoid `useCallback` for style objects; they're recreated on each render safely
- Don't call `useThemeColors()` multiple times; store result in variable
- Use constant style objects for static styling; reserve `useThemeColors()` for theme-dependent colors
