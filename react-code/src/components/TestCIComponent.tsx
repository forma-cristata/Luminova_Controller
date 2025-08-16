// This is a test file to validate CI pipeline error detection
import React from "react";

// Intentional linting errors for testing:
const unusedVariable = "This variable is unused";  // Should trigger unused variable warning
var badVariableDeclaration = "should use const/let";  // Should trigger var usage warning

export default function TestComponent() {
    // Intentional console.log (often flagged by linters)
    console.log("Testing CI pipeline");
    
    return (
        <div>Test Component</div>  // Wrong element for React Native
    );
}
