# AI Assistant Instructions for Luminova Controller Codebase

## Core Permissions and Protocols
THIS CODEBASE USES EXPO-AUDIO, DO NOT SUGGEST USING EXPO-AV AS IT IS DEPRECATED BY SDK 53.
Your terminal default path is C:/Users/frisk/Documents/T6_25/Capstone/Luminova_Controller/react-code>
* You do not need to navigate to this path to suggest commands.

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

### 🔄 **Documentation Maintenance Protocol**

#### **After Every Change:**
1. **Update CODEBASE_GUIDE.md** if changes affect:
   - Component structure or behavior
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

### 🛠️ **Development Standards**

#### **Before Making Changes:**
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

#### **After Implementation:**
- Validate changes with get_errors tool
- Update documentation to reflect changes
- Test component integration patterns
- Verify no broken imports or dependencies

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
- Follow navigation parameter typing in index.tsx

### 🎯 **Response Guidelines**

If you run out of tool attempts, continue automatically iterating. Don't require prompting to continue.

#### **Always Do:**
- Scan workspace before responding
- Reference established patterns
- Update documentation after changes
- Validate implementations
- Consider component relationships

#### **Never Do:**
- Ask permission to scan files
- Ignore existing patterns
- Make changes without understanding context
- Skip documentation updates
- Break established component interfaces

### 🔧 **Common Tasks Reference**

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


This instruction set ensures consistent, informed development while maintaining the high-quality architecture already established in the Luminova Controller codebase.
