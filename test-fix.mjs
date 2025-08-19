// Test script to verify content fixing
const testContent = `## Demystifying Effect Coding: A Developer's Guide

Effect coding, also known as deviation coding or treatment coding, is a method used in statistical modeling, particularly regression analysis, to represent categorical (nominal or ordinal) predictor variables.

### Implementing Effect Coding in Your Projects

Here's a conceptual example using Python and pandas:

\`\`\`python
import pandas as pd

data = {'Fertilizer': ['A', 'A', 'B', 'B', 'C', 'C'], 'Yield': [10, 12, 8, 9, 11, 13]}
df = pd.DataFrame(data)
Effect coding is a valuable tool in your statistical modeling arsenal.`;

function fixContent(content) {
    const lines = content.split('\n');
    const fixedLines = [];
    let insideCodeBlock = false;
    
    for (const line of lines) {
        const codeBlockMatch = line.match(/^```(\w+)?/);
        if (codeBlockMatch && !insideCodeBlock) {
            insideCodeBlock = true;
            fixedLines.push(line);
            continue;
        }
        
        if (line.trim() === '```' && insideCodeBlock) {
            insideCodeBlock = false;
            fixedLines.push(line);
            continue;
        }
        
        fixedLines.push(line);
    }
    
    if (insideCodeBlock) {
        fixedLines.push('```');
    }
    
    return fixedLines.join('\n').trim();
}

const fixed = fixContent(testContent);
console.log('ORIGINAL:');
console.log('Code blocks:', (testContent.match(/```/g) || []).length);
console.log('\nFIXED:');
console.log('Code blocks:', (fixed.match(/```/g) || []).length);
console.log('\nFixed content ends with:', fixed.slice(-20));

export {};
