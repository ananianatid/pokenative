# Styling Rules & Conventions

## StyleSheet & Type Safety
- ✅ Always create style constants using `StyleSheet.create()` with `satisfies ViewStyle` type annotation
- ❌ Never write styles directly in JSX—always extract to a separate `Styles` constant
- ❌ Never use inline style objects like `style={{ flex: 1 }}`

## Component Styling Pattern
```tsx
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  } satisfies ViewStyle,
  text: {
    fontSize: 16,
  } satisfies TextStyle,
});

export const MyComponent = ({ style, ...rest }) => (
  <View style={[Styles.container, style]} {...rest} />
);
```

## Design System

### Colors
- Use `useThemeColors()` hook to access theme-aware colors
- Reference from [constants/colors.ts](constants/colors.ts) 
- **Currently**: Light/dark themes have identical values; implement dark mode when themes diverge
- Type-specific colors available (fire, water, electric, bug, etc.) but not yet used in UI

### Shadows (Elevation)
- Use `Shadows.dp2` for card/component elevation
- Reference from [constants/shadows.ts](constants/shadows.ts)
- Only `dp2` currently defined; add `dp4`, `dp8`, etc. as needed following Material Design convention

### Typography
- Use `<ThemedText>` with variants: `body3`, `headline`, `caption`, `subtitle1`, `subtitle2`, `subtitle3`
- Don't use raw `<Text>`—always wrap with ThemedText for consistency
- Each variant has predefined size, weight, and color

## SafeAreaView & Layout
- Wrap main screen containers with `<SafeAreaView>` from `react-native-safe-area-context`
- Never use `react-native`'s SafeAreaView (incorrect import)
- Use `<Row>` component for horizontal layouts with optional `gap` prop

## Navigation & Routing
- Add `screenOptions={{ headerShown: false }}` to Stack Navigator to hide default headers
- URL params must always be strings: `String(value)` when using Link/router navigation
- Use `@/` path aliases for imports to avoid relative `../../` paths

## Modal Pattern
```tsx
const [visible, setVisible] = useState(false);

return (
  <>
    <Pressable onPress={() => setVisible(true)}>
      <Text>Open</Text>
    </Pressable>
    
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={[{ flex: 1 }]} onPress={() => setVisible(false)} />
      {/* Modal content */}
    </Modal>
  </>
);
```

## Component Composition
- Use `{style, ...rest}` pattern for passthrough styling
- Apply styles as array: `[Styles.base, customStyle, dynamicStyle]`
- This allows parent components to override child styles when needed

## French Design System Notes (Archive)
- toujours créer les const et les variables avec des annotations de styles
- ne jamais ecrire directement du style dans la view mais utiliser une const Styles appelant StyleSheet.create
- Les paramètres d'URL doivent toujours être des strings (utiliser `String(value)` si nécessaire)
- utiliser `SafeAreaView` pour wrapper les composants principaux et éviter les zones non-utilisables
- ajouter `screenOptions={{ headerShown: false }}` dans les Stack Navigator layouts pour masquer les headers par défaut