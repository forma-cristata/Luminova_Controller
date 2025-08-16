# TEMPORARY ANIMATED DOTS LINT FIX INSTRUCTIONS

## PRIOR CHECK DIRECTIVE
**BEFORE ANY OTHER ACTIONS:** Always run `npm run format-lint` to check if AnimatedDots still has lint errors.

## CURRENT STATUS: ACTIVE FIXES NEEDED
The AnimatedDots component in `src/components/animations/AnimatedDots.tsx` has 12 useCallback dependency errors.

## SYSTEMATIC FIX ORDER
Fix these animation functions by wrapping them in `useCallback` hooks in this exact order:

1. ✅ blenderAnimation - NEEDS useCallback wrapper
2. ✅ christmasAnimation - NEEDS useCallback wrapper  
3. ✅ comfortSongAnimation - NEEDS useCallback wrapper
4. ✅ funkyAnimation - NEEDS useCallback wrapper
5. ✅ moldAnimation - NEEDS useCallback wrapper
6. ✅ progressiveAnimation - NEEDS useCallback wrapper
7. ✅ stillAnimation - NEEDS useCallback wrapper
8. ✅ strobeChangeAnimation - NEEDS useCallback wrapper
9. ✅ technoAnimation - NEEDS useCallback wrapper
10. ✅ traceManyAnimation - NEEDS useCallback wrapper
11. ✅ traceOneAnimation - NEEDS useCallback wrapper
12. ✅ tranceAnimation - NEEDS useCallback wrapper

## COMPLETION CONDITION
When `npm run format-lint` returns NO errors for AnimatedDots:
1. Update copilot-instructions.md to reference these temporary instructions
2. After successful completion, delete this file
3. Remove temporary reference from copilot-instructions.md

## PROCESS NOTES
- Fix ONE function at a time
- Verify each fix doesn't break the code
- Each function needs proper dependency arrays in their useCallback wrappers
- Follow the established pattern from other useCallback functions in the file
