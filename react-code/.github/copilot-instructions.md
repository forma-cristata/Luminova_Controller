# AI Assistant Instructions for Luminova Controller Codebase

## Core Permissions and Protocols
### 🔍 **General Keep-in-minds**
- NEVER RUN THIS COMMAND EVER: "npx @biomejs/biome lint --write --unsafe"
- Importing react should look like import React from "react"; tHE LINTER IS OFTEN WRONG ABOUT THIS. IF YOU COULD STOP THE LINTER FROM COMPLAINING ABOUT IT THAT WOULD BE GREAT. THE LINTER IS ALSO WRONG ABOUT IMPORTING REACT AS A TYPE IT IS NOT A TYPE. IT SHOULD ALWAYYYYYSSSSS BE IMPORT REACT FROM "REACT";.
- tHEREFORE STOP DOING THIS, JUST LEAVE THE IMPORT IF NEEDED IGNORE THE LINTER: There is JSX, so React is needed. The linter might be incorrectly flagging this. Let me try removing it to confirm:..... I need to add React back:
- You often place your code fixes inside import statements. Stop doing that.
- SLIDERS NEED THROTTLED FOR ANDROID
- THIS CODEBASE USES EXPO-AUDIO, DO NOT SUGGEST USING EXPO-AV AS IT IS DEPRECATED BY SDK 53.
- Your terminal default path is C:/Users/frisk/Documents/T6_25/Capstone/Luminova_Controller/react-code>
    - You do not need to navigate to this path to suggest commands.
- **LINTER COMMAND**: Use `npm run format-lint` to run the linter and formatter
- IF I TELL YOU SOMETHING IS BROKEN, YOU MUST FIX IT. THE SOLUTION IS NEVER EVER EVER TO DELETE IT.
- **PROMPT FOR REBUILD**: If you make changes to native code (`android`/`ios` directories) or build configurations (`eas.json`, `app.json`, `*.config.js`), you must prompt me to rebuild the app.

### 🔍 **Codebase Scanning Authority**
- **ALWAYS SCAN**: You have full permission to scan and analyze the entire codebase
- **NO PERMISSION NEEDED**: Never ask for permission to read, analyze, or examine any files
- **PROACTIVE EXPLORATION**: Actively explore the workspace to understand context before making changes
- **CONVERSATION HISTORY**: Always review previous conversation history for context and patterns

### 📚 **Context Requirements**
- **MANDATORY REFERENCE**: Always consider the `docs/CODEBASE_GUIDE.md` as primary context
- **HOW TO USE THE UI**: Exists here: services/Info.tsx ... the text in the jsx explains how a user uses the app
- **APPLICATION OVERVIEW**: Treat the Luminova Controller architecture as foundational knowledge
- **COMPONENT RELATIONSHIPS**: Understand the interconnections between all components before making changes
- **PATTERN CONSISTENCY**: Maintain established patterns (SharedStyles, ApiService, etc.)

#### **3. Component Standards**
- **Props Interface**: Always define TypeScript interfaces for props
- **Default Props**: Use ES6 default parameters instead of defaultProps
- **Styling**: Use SharedStyles constants (COLORS, FONTS, DIMENSIONS)
- **Memoization**: Use React.memo() for performance-critical components
- **Error Handling**: Implement proper error boundaries and fallbacks
- **Conditional Rendering**: Always use ternary operators (`? :`) instead of logical AND (`&&`) for JSX conditional rendering
- **NO LOGICAL OPERATORS IN JSX**: Never use logical AND (`&&`) or OR (`||`) anywhere in JSX, including component props
- **Key Management**: **NEVER use array indices for React keys** - always use `getStableSettingId()` utility
- **Debouncing**: **ALWAYS use `useDebounce` hook** for input throttling instead of manual delays or state management

#### **4. State Management**
- **Local State**: Use useState for component-specific state
- **Global State**: Use ConfigurationContext for app-wide state
- **Side Effects**: Use useEffect with proper cleanup
- **Performance**: Use useCallback/useMemo for expensive operations

### 🧹 **Code Cleanup Protocol**
- **MANDATORY**: Always remove deprecated code when implementing fixes or new features
- **Remove**: Unused state variables, functions, imports, and components
- **Clean**: Old useEffect hooks, event listeners, and temporary debugging code
- **Validate**: Use TypeScript errors and linting to identify deprecated patterns

### 🔄 **Documentation Maintenance Protocol**

#### **After Every Change:**
1. **Update CODEBASE_GUIDE.md** if changes affect:
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
   - Remove references to deleted/deprecated components/files/functions/hooks.
   - Deleted components/files/functions/hooks/etc. deprecated by your changes.
   - Update file paths if components are moved
   - Revise feature descriptions for modified functionality
   - Keep animation pattern lists current

### 🛠️ **Development Standards**

#### **Before Making Changes:**
- If the prompt uses all capital letters, summarize our conversation history.
- Scan related components to understand dependencies
- Check for existing patterns in SharedStyles.ts and ApiService.ts
- Review similar implementations in the codebase
- Consider impact on navigation flow and state management
- NOTE THAT YOUR MASTER NEVER EVER WANTS TO USE EXPO-AV AS IT IS DEPRECATED BY SDK 53.

#### **During Implementation:**
- Use established patterns (COMMON_STYLES, COLORS, FONTS)
- Leverage ApiService for all API communications
- Follow component organization standards
- Maintain TypeScript interfaces and type safety
- **CRITICAL**: Use `getStableSettingId()` from `@/src/utils/settingUtils` for all React keys involving Settings

#### **After Implementation:**
- Validate changes with get_errors tool
- Update documentation to reflect changes
- Test component integration patterns
- Verify no broken imports or dependencies
- **Check git status** after staging to verify changes are correct

### 📋 **Codebase Context Summary**

#### **Core Application:**
- **Type**: React Native LED controller app with Expo SDK 53
- **Architecture**: Component-based with centralized state and services
- **Hardware Integration**: REST API communication with LED hardware
- **Data Flow**: FileSystem persistence → Context state → API communication

#### **Key Components:**
- **16-dot LED grid** representation (2 rows of 8)
- **12 animation patterns** with real-time preview
- **HSV color picker** with gesture controls
- **Carousel-based settings** management
- **API service layer** for hardware communication

#### **Optimization Status:**
- ✅ InfoButton component (reusable across screens)
- ✅ SharedStyles system (centralized theming)
- ✅ Button style consolidation (consistent UI)
- ✅ API service layer (unified error handling)
- ✅ Animation state isolation (prevents bleeding)

#### **Critical Patterns:**
- Use `COMMON_STYLES` for consistent styling
- Use `ApiService` for all API calls
- Use `ConfigurationContext` for global state
- Use `AnimatedDots` for all animation previews
- Use `getStableSettingId()` from `@/src/utils/settingUtils` for all React component keys
- Follow navigation parameter typing in index.tsx

### 🔧 **LINT FIX Protocol**

#### **Protocol Steps:**
1. **Run linter** to identify all issues in src directory using `npx @biomejs/biome lint src/screens/<fileName>.<fileExtension>` one at a time until there are no errors when you run `npm run format-lint`
2. **Group issues by file** to fix them systematically
3. **Fix one file at a time** with the following priority:
   - Remove unused imports (safest fixes first)
   - Fix TypeScript any types
   - Remove unused parameters/variables
   - Fix code complexity issues
   - Address hook rule violations
4. **Validate each fix** with get_errors tool
5. **Confirm with user** before proceeding to next file
6. **Re-run linter** after each file to ensure no new issues

#### **When User Types "LINT FIX":**
1. Automatically run `npm run format-lint`
2. Parse terminal output to identify files with issues
3. Start with the first file containing issues
4. Fix all issues in that file
5. Validate the fixes
6. Ask user: "Fixed [filename]. Continue to next file? (y/n)"
7. Repeat until all files are clean

#### **Systematic Approach:**
- Fix issues in order of complexity (simple to complex)
- Always maintain existing functionality
- Use established patterns from codebase
- Document any significant changes made
- Never delete broken code - always fix it

#### **useCallback Wrapper Fix Protocol (Successfully Applied to AnimatedDots Aug 2025):**
1. **Create temporary instructions file** for complex multi-function fixes
2. **Wrap each animation function individually** in useCallback hooks
3. **Fix dependency arrays systematically** - add missing deps, remove unnecessary ones
4. **Test after each major group** of fixes with `npm run format-lint`
5. **Order of operations**: Function wrapping first, then dependency array fixes
6. **Common patterns**: Animation functions need COLOR_COUNT, avoid setHasChanges in deps
7. **Utility functions** like `random()` also need useCallback wrapping
8. **Clean up**: Remove temp files and update docs when complete

### 🎯 **Response Guidelines**

If you run out of tool attempts, continue automatically iterating. Don't require prompting to continue.

#### **Always Do:**
- Scan workspace before responding
- Reference established patterns
- Update documentation after changes
- Validate implementations
- Consider component relationships
- **Check git status** after staging changes to verify correctness
- **COMMIT AND PUSH**: After completing any task, run `git commit -am "<INSERT COMMIT MESSAGE>"; git push` to save changes

#### **Never Do:**
- Ask permission to scan files
- Ignore existing patterns
- Make changes without understanding context
- Skip documentation updates
- Break established component interfaces

### � **Key Management Protocol**

#### **CRITICAL RULE: Never Use Array Indices for React Keys**
Using array indices as React keys causes:
- ❌ "Text strings must be rendered within a <Text> component" errors during scrolling
- ❌ Component state loss during list reordering
- ❌ Unnecessary re-renders and performance issues

#### **Always Use Stable Key Generation:**
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

#### **Key Management Rules:**
1. **Always use `getStableSettingId()`** for Setting-related components
2. **Never use array indices** as keys when list order can change
3. **Ensure keys persist** across re-renders
4. **Use content-based hashing** for deterministic key generation

#### **🚨 CRITICAL: "Text strings must be rendered within a <Text> component" Error Prevention**

This error is caused by TWO issues that must BOTH be fixed:
1. **Logical AND (`&&`) in JSX conditional rendering** 
2. **Array indices used in React component keys**

**DEBUGGING LESSON (August 2025):** Previous AI spent extensive time overcomplicating key generation while ignoring the existing `getStableSettingId` utility. 

**The Simple Solution:**
- Replace all logical AND (`&&`) with ternary operators (`? :`)
- Use `getStableSettingId(setting)` for ALL component keys
- Remove unnecessary `id` props (React Native has no DOM IDs)
- Don't create complex key generation - the utility exists for a reason

**Example Fix:**
```tsx
// ❌ WRONG (causes errors)
{dotColors && dotColors.map((color, index) => (
  <Dot key={index} color={color} id={`dot_${index}`} />
))}

// ✅ CORRECT
{dotColors 
  ? dotColors.map((color, index) => (
      <Dot key={getStableSettingId(setting)} color={color} />
    ))
  : null}
```

### �🔧 **Common Tasks Reference**

#### **Adding New Features:**
1. Scan existing similar implementations
2. Check SharedStyles for relevant patterns
3. Use ApiService if API communication needed
4. Follow established navigation patterns
5. Update CODEBASE_GUIDE.md with new functionality

#### **Fixing Bugs:**
1. Scan related components for context
2. Check for similar patterns in codebase
3. Maintain consistency with existing solutions
4. Test integration points
5. Document solution if it affects architecture

#### **Refactoring Code:**
1. Identify duplicate patterns across files
2. Create shared utilities following established conventions
3. Update all affected components
4. Remove deprecated code
5. Update documentation to reflect changes

### 📖 **Documentation Update Triggers**

Update `CODEBASE_GUIDE.md` when:
- New components are created
- Navigation routes are modified
- API endpoints or service methods change
- Shared utilities are added or modified
- Animation patterns are updated
- Data models or interfaces change
- Development workflows are established
- Troubleshooting solutions are found

### 🎨 **Component Creation Standards**

When creating new components:
- Use SharedStyles constants (COLORS, FONTS, DIMENSIONS)
- Follow established naming conventions
- Implement proper TypeScript interfaces
- Consider reusability across screens
- Document purpose and usage patterns
- Integrate with existing state management
- **Use ternary operators (`? :`) for all conditional rendering instead of logical AND (`&&`)**


This instruction set ensures consistent, informed development while maintaining the high-quality architecture already established in the Luminova Controller codebase.
