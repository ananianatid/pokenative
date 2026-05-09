---
name: Create Pokemon Component
description: This skill should be used when the user wants to "create a pokemon component", "scaffold a pokemon UI", "add a stat display", "create a type badge", "build a move list", or needs to create domain-specific Pokemon UI components with correct styling patterns and conventions.
version: 0.1.0
---

# Create Pokemon Component Skill

This skill guides creating domain-specific Pokemon UI components that follow project patterns and conventions.

## Component Architecture Patterns

All Pokemon components follow strict patterns:

1. **Styling**: Always use `const Styles = StyleSheet.create()` with `satisfies ViewStyle` type annotation
2. **Theme Colors**: Access via `useThemeColors()` hook; use type colors from `Colors.type[typeName]`
3. **Composition**: Use `{style, ...rest}` prop spreading; apply styles as array `[Styles.base, style, dynamic]`
4. **Typography**: Use `<ThemedText>` with variant prop (body3, headline, caption, subtitle1-3), never raw `<Text>`
5. **Layout Primitives**: Use `<Row>` for horizontal layouts with optional `gap` prop; use `<View>` for containers
6. **Cards**: Wrap in `<Card>` component for consistent elevation and background; Card merges theme color automatically
7. **Imports**: Always use `@/` path aliases to avoid relative imports

## Location & Organization

- **Reusable components**: `components/` (e.g., `Card.tsx`, `ThemedText.tsx`, `Row.tsx`)
- **Pokemon-specific components**: `components/pokemon/` (e.g., `PokemonCard.tsx`, `PokemonStat.tsx`, `PokemonType.tsx`)
- **Domain-specific logic**: Keep Pokemon components in `pokemon/` subdirectory

## Common Pokemon Component Examples

### PokemonType (Type Badge)
Display a Pokemon's type with background color from `Colors.type`:
- Single `<View>` with rounded corners
- Flex center alignment
- Use type-specific color as backgroundColor
- Wrap text in `<ThemedText>` with white/light color for contrast

### PokemonStat (Stat Row)
Display individual stats (HP, Attack, Defense, etc.):
- `<Row>` with gap for stat name and bar
- `<ThemedText variant="body3">` for stat name (capitalized)
- Progress bar as `<View>` with flex and fixed height (e.g., 6)
- Use theme color for bar background
- Optional: `<ThemedText>` for stat value (e.g., "145")

### PokemonSpec (Specification Row)
Display Pokemon specs (Height, Weight, Base Experience):
- `<Row>` with gap separating label and value
- `<ThemedText variant="caption">` for label (gray color)
- `<ThemedText variant="subtitle2">` for value
- Optional icon on left side

### MoveList (Moves Display)
Display Pokemon moves in a scrollable list:
- `<FlatList>` or `<ScrollView>` container
- Each move as `<Row>` with flex wrap capability
- Move name in `<ThemedText variant="body3">`
- Optional: type badges for move types
- Use gap for spacing between moves

## Styling Best Practices

```tsx
// ✅ CORRECT: Type-safe StyleSheet with composition
const Styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  } satisfies ViewStyle,
  text: {
    fontSize: 14,
    fontWeight: '600',
  } satisfies TextStyle,
});

export const MyPokemonComponent = ({ style, ...rest }) => (
  <View style={[Styles.container, style]} {...rest} />
);

// ❌ WRONG: Inline styles
export const BadComponent = () => (
  <View style={{ flex: 1, backgroundColor: 'blue' }} />
);
```

## Color Palette Usage

```tsx
const colors = useThemeColors();

// Theme colors (light/dark - currently identical)
colors.grayLight       // Light gray
colors.grayDark        // Dark gray
colors.tint            // Brand red (#DC0A2D)
colors.grayBackground  // Background gray
colors.grayWhite       // White

// Pokemon type colors (17 types available)
Colors.type['fire']      // Fire type orange
Colors.type['water']     // Water type blue
Colors.type['electric']  // Electric type yellow
// ... bug, dark, dragon, fairy, fighting, flying, ghost, grass, ground, ice, normal, poison, psychic, rock, steel
```

## Example: Creating a Type Badge Component

```tsx
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/colors';

const Styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,
  text: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  } satisfies TextStyle,
});

interface PokemonTypeBadgeProps {
  type: keyof typeof Colors.type;
  style?: ViewStyle;
}

export const PokemonTypeBadge = ({ type, style }: PokemonTypeBadgeProps) => {
  const backgroundColor = Colors.type[type];
  
  return (
    <View style={[Styles.badge, { backgroundColor }, style]}>
      <ThemedText 
        variant="caption" 
        color="grayWhite"
        style={Styles.text}
      >
        {type}
      </ThemedText>
    </View>
  );
};
```

## Workflow

1. **Identify the component need**: Stat display? Type badge? Move list?
2. **Check existing components**: Review `components/pokemon/` to avoid duplication
3. **Plan the structure**: Sketch props, styling needs, and color usage
4. **Create file**: Add to `components/pokemon/ComponentName.tsx`
5. **Apply patterns**:
   - Define `Styles` constant with `satisfies ViewStyle`
   - Export component with `{style, ...rest}` pattern
   - Use `ThemedText` for all text
   - Use type colors from `Colors.type[typeName]` for Pokemon-specific styling
6. **Test styling**: Verify array style composition works correctly
7. **Use in detail page**: Import and use in [app/pokemon/[id].tsx](app/pokemon/[id].tsx)
