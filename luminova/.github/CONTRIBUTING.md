# Contributing to Luminova Controller

## 🚨 Critical Rules
- NEVER use logical conditional operators (`&&`) always use ternary (`? :`), especially in JSX
- NEVER use array indices for React keys - use `getStableSettingId()`
- ALWAYS import React: `import React from 'react';`
- ALWAYS use `npm run format-lint` before commits

## File Naming
- **Components/Screens:** PascalCase (`SettingBlock.tsx`)
- **Services/Utils:** PascalCase (`ApiService.ts`) 
- **Hooks:** camelCase (`useDebounce.ts`)
- **Config:** camelCase (`constants.ts`)

## Component Template
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, COMMON_STYLES } from '@/src/styles/SharedStyles';

interface ComponentNameProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
}

export default function ComponentName({ title, onPress, disabled = false }: ComponentNameProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    fontFamily: FONTS.SIGNATURE,
    color: COLORS.WHITE,
  },
});
```

### 📦 **Import Organization**
```typescript
// External libraries first
import React from 'react';
import { View, Text } from 'react-native';
import { useFonts } from 'expo-font';

// Internal components
import BackButton from '@/src/components/buttons/BackButton';
import InfoButton from '@/src/components/buttons/InfoButton';

// Shared resources
import { COLORS, COMMON_STYLES } from '@/src/styles/SharedStyles';

// Services and utilities
import { ApiService } from '@/src/services/ApiService';

// Types and interfaces
import type { Setting } from '@/src/types/SettingInterface';
```

### ⚡ **Component Standards**

#### **Required Practices**
- **Props Interface**: Always define TypeScript interfaces for props
- **Default Props**: Use ES6 default parameters instead of defaultProps
- **Styling**: Use SharedStyles constants (COLORS, FONTS, DIMENSIONS)
- **Memoization**: Use React.memo() for performance-critical components
- **Error Handling**: Implement proper error boundaries and fallbacks

#### **Critical Rules**
- **Conditional Rendering**: Always use ternary operators (`? :`) instead of logical AND (`&&`) for JSX conditional rendering
- **NO LOGICAL OPERATORS IN JSX**: Never use logical AND (`&&`) or OR (`||`) anywhere in JSX, including component props
- **Key Management**: **NEVER use array indices for React keys** - always use `getStableSettingId()` utility
- **Debouncing**: **ALWAYS use `useDebounce` hook** for input throttling instead of manual delays or state management

#### **React Import Standards**
- **ALWAYS** import React as: `import React from 'react';`
- **NEVER** import React as a type: `import type React from 'react';`
- **IGNORE LINTER** if it suggests removing React imports when JSX is present

### 🎨 **Conditional Rendering Standards**

#### **Always Use Ternary Operators**
```typescript
// ✅ CORRECT: Use ternary operators
{condition ? <Component /> : null}
{condition ? <ActiveComponent /> : <FallbackComponent />}
{condition ? (
  <>
    <MultipleComponents />
  </>
) : null}

// ❌ WRONG: Don't use logical AND operators
{condition && <Component />}
{condition && (
  <>
    <MultipleComponents />
  </>
)}
```

#### **Component Props Standards**
```typescript
// ✅ CORRECT: Ternary operators in props  
<Button disabled={isLoading ? true : isPending ? true : false} />
<View style={[baseStyle, error ? errorStyle : null]} />

// ❌ WRONG: Logical operators in props
<Button disabled={isLoading || isPending} />
<View style={[baseStyle, error && errorStyle]} />
```

### 🔑 **Key Management Protocol**

#### **CRITICAL RULE: Never Use Array Indices for React Keys**
Using array indices as React keys causes:
- ❌ "Text strings must be rendered within a <Text> component" errors during scrolling
- ❌ Component state loss during list reordering
- ❌ Unnecessary re-renders and performance issues

#### **Always Use Stable Key Generation**
```typescript
// ✅ CORRECT: Use stable content-based keys
import { getStableSettingId } from "@/src/utils/settingUtils";

{settingsData.map(item => (
  <SettingBlock
    key={getStableSettingId(item)}  // ✅ Stable, unique key
    setting={item}
  />
))}

// ❌ NEVER DO: Use array indices
{settingsData.map((item, index) => (
  <SettingBlock
    key={index}  // ❌ BAD: causes rendering issues
    key={`item-${index}`}  // ❌ BAD: still index-based
  />
))}
```

### ⌨️ **Keyboard Handling**

All screens containing `TextInput` components must implement keyboard dismissal:

```typescript
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function ScreenWithInput() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Your screen content */}
      </View>
    </TouchableWithoutFeedback>
  );
}
```

## Development Workflow

### 🧹 **Code Cleanup Protocol**
- **MANDATORY**: Always remove deprecated code when implementing fixes or new features
- **Remove**: Unused state variables, functions, imports, and components
- **Clean**: Old useEffect hooks, event listeners, and temporary debugging code
- **Validate**: Use TypeScript errors and linting to identify deprecated patterns

### 📋 **Before Making Changes**
1. **Scan related components** to understand dependencies
2. **Check for existing patterns** in SharedStyles.ts and ApiService.ts
3. **Review similar implementations** in the codebase
4. **Consider impact** on navigation flow and state management

### ⚡ **During Implementation**
1. **Use established patterns** (COMMON_STYLES, COLORS, FONTS)
2. **Leverage ApiService** for all API communications
3. **Follow component organization** standards
4. **Maintain TypeScript interfaces** and type safety
5. **Use `getStableSettingId()`** from `@/src/utils/settingUtils` for all React keys involving Settings

### ✅ **After Implementation**
1. **Remove deprecated code** - Clean up any unused/replaced code
2. **Validate changes** with get_errors tool
3. **Update documentation** to reflect changes
4. **Test component integration** patterns
5. **Verify no broken imports** or dependencies
6. **Check git status** - Run `git status` after staging to verify changes are correct

## Development Environment

### 🔧 **Required Tools**
- **Node.js** (version specified in package.json)
- **npm** or **yarn**
- **Expo CLI** for development
- **Android Studio** or **Xcode** for device testing

### 📋 **Available Scripts**
- `npm run format-lint` - Run Biome linter and formatter with fixes
- `npm run format` - Format code with Biome
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator

### 🚫 **Forbidden Commands**
- **NEVER RUN**: `npx @biomejs/biome lint --write --unsafe`
- **NEVER SUGGEST**: `expo-av` (deprecated by SDK 53, use `expo-audio` instead)

## Linting & Code Quality

### 🔧 **LINT FIX Protocol**

#### **When Running Lint Fixes:**
1. **Run linter**: `npm run format-lint`
2. **Group issues by file** to fix them systematically
3. **Fix one file at a time** with priority:
   - Remove unused imports (safest fixes first)
   - Fix TypeScript any types
   - Remove unused parameters/variables
   - Fix code complexity issues
   - Address hook rule violations
4. **Validate each fix** before proceeding
5. **Re-run linter** after each file to ensure no new issues

#### **Systematic Approach:**
- Fix issues in order of complexity (simple to complex)
- Always maintain existing functionality
- Use established patterns from codebase
- Document any significant changes made
- **Never delete broken code** - always fix it

## State Management Standards

### 🏗️ **State Architecture**
- **Local State**: Use useState for component-specific state
- **Global State**: Use ConfigurationContext for app-wide state
- **Side Effects**: Use useEffect with proper cleanup
- **Performance**: Use useCallback/useMemo for expensive operations

### 🎣 **Custom Hooks**
- **useDebounce**: ALWAYS use for input throttling instead of manual delays
- **Naming**: Start with "use" and use camelCase
- **File placement**: `src/hooks/` directory

## Hardware Integration

### 🔌 **API Communication**
- **ALWAYS use ApiService** for all hardware communication
- **Check connectivity** using `isShelfConnected` from ConfigurationContext
- **Disable hardware-dependent features** when shelf is not detectable
- **Handle errors gracefully** with user-friendly messages

### 📱 **Platform Considerations**
- **Android**: SLIDERS NEED THROTTLED for performance
- **iOS**: Test gesture recognizers on physical devices
- **Cross-platform**: Use SharedStyles for consistent appearance

## Testing Standards

### ✅ **Component Testing**
- Test component in both animated and static modes
- Verify proper prop handling and TypeScript compliance
- Test integration with existing navigation flow
- Validate performance with large datasets

### 🔄 **Integration Testing**
- Test API communication with hardware
- Verify state management across screens
- Test navigation parameter passing
- Validate data persistence

## Documentation Maintenance

### 📚 **Update Requirements**

#### **After Every Change:**
1. **Update documentation** if changes affect:
   - Component structure or behavior
   - Codebase file structure in any way
   - Navigation flow
   - Data models or interfaces
   - API integration patterns
   - New shared resources or utilities

2. **Document New Patterns:**
   - New component types or architectures
   - Additional optimization techniques
   - Changed development workflows
   - Updated troubleshooting information

3. **Maintain Accuracy:**
   - Remove references to deleted/deprecated components
   - Update file paths if components are moved
   - Revise feature descriptions for modified functionality
   - Keep animation pattern lists current

## Troubleshooting

### 🚨 **Common Issues**

#### **"Text strings must be rendered within a <Text> component" Error**
This error is caused by TWO issues that must BOTH be fixed:
1. **Logical AND (`&&`) in JSX conditional rendering** 
2. **Array indices used in React component keys**

**Solution:**
- Replace all logical AND (`&&`) with ternary operators (`? :`)
- Use `getStableSettingId(setting)` for ALL component keys
- Remove unnecessary `id` props (React Native has no DOM IDs)

#### **Linter Complaints About React Import**
- **Always keep**: `import React from 'react';` when JSX is present
- **Ignore linter** suggestions to remove React import
- **Never import React as type**: It's a runtime dependency, not just a type

#### **Performance Issues**
- Use `useDebounce` for input throttling
- Implement `React.memo()` for expensive components
- Use `getStableSettingId()` for consistent React keys
- Clean up useEffect hooks with proper dependencies

## CI/CD Pipeline

### 🔄 **Automated Checks**
The project includes automated quality checks that run on every push:
- **TypeScript compilation** validation
- **Biome linting** and formatting checks
- **Dependency analysis** and security scanning

### 📋 **Pre-Push Checklist**
1. Run `npm run format-lint` locally to fix issues
2. Ensure TypeScript compiles: `npx tsc --noEmit`
3. Test key functionality after changes
4. **Check git status**: Run `git status` after staging to verify changes
5. Commit with descriptive messages (see commit guidelines below)
6. Push - CI pipeline will validate code quality

### 💬 **Commit Message Guidelines**

#### **For Human Contributors:**
- **Keep it concise**: Commit messages should be no longer than one sentence
- **Be descriptive**: Clearly explain what was changed and why
- **Use present tense**: "Add feature" not "Added feature"
- **Include context**: Mention component or area affected

#### **For AI Contributors:**
- **Single sentence rule**: Commit messages must not exceed one sentence length
- **Multi-line format allowed**: Use title + detailed bullet points if needed
- **Include scope**: Specify which components/screens were modified
- **Summarize impact**: Brief mention of user-facing changes or fixes

#### **Examples:**
```
✅ Good: "Add responsive scaling to InfoButton for iPhone 16 Plus compatibility"
✅ Good: "Fix LedToggle positioning to match InfoButton alignment"
❌ Too long: "This commit adds responsive scaling to the InfoButton component and also fixes the positioning to work better on larger screens like the iPhone 16 Plus and makes sure it aligns properly with other elements."
```

## Native Code Changes

### 🏗️ **Build Configuration**
If you make changes to:
- Native code (`android`/`ios` directories)
- Build configurations (`eas.json`, `app.json`, `*.config.js`)

**You must prompt for app rebuild** as these changes require recompilation.

## Getting Help

### 📖 **Resources**
- Review existing similar implementations in the codebase
- Check SharedStyles for established patterns
- Consult ApiService for API communication examples
- Reference ConfigurationContext for state management

### 🤝 **Community Guidelines**
- Be respectful and constructive in code reviews
- Provide detailed descriptions in pull requests
- Test your changes thoroughly before submitting
- Follow the established patterns and conventions

## Response Guidelines for AI Contributors

### ✅ **Always Do:**
- Scan workspace before responding
- Reference established patterns
- Update documentation after changes
- Validate implementations
- Consider component relationships
- Commit and push changes after completing tasks

### ❌ **Never Do:**
- Ask permission to scan files
- Ignore existing patterns
- Make changes without understanding context
- Skip documentation updates
- Break established component interfaces
- Delete broken code instead of fixing it

---

Thank you for contributing to the Luminova Controller project! Following these guidelines ensures consistent, high-quality code that maintains the project's architecture and performance standards.
