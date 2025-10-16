#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of all entity files that need to be converted
const entityFiles = [
  'src/entities/courses/Enrollment.js',
  'src/entities/courses/Assignment.js',
  'src/entities/courses/AssignmentSubmission.js',
  'src/entities/courses/Achievement.js',
  'src/entities/courses/Certificate.js',
  'src/entities/payments/Payment.js',
  'src/entities/notifications/Notification.js',
  'src/entities/reviews/Review.js',
  'src/entities/wishlist/WishlistItem.js',
  'src/entities/admin/SystemSetting.js',
  'src/entities/admin/SystemLog.js',
  'src/entities/content/MediaFile.js',
  'src/entities/content/ContentPage.js',
  'src/entities/social/Follow.js',
  'src/entities/social/Comment.js',
  'src/entities/social/Like.js',
  'src/entities/social/SocialPost.js',
  'src/entities/inventory/InventoryItem.js',
  'src/entities/promotions/Promotion.js',
  'src/entities/stores/Store.js',
  'src/entities/analytics/AnalyticsEvent.js',
  'src/entities/messaging/Conversation.js',
  'src/entities/messaging/Message.js'
];

// Function to convert decorator syntax to EntitySchema syntax
function convertEntityFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Skip if already converted
  if (content.includes('EntitySchema')) {
    console.log(`Already converted: ${filePath}`);
    return;
  }

  console.log(`Converting: ${filePath}`);
  
  // Extract entity name from @Entity('table_name')
  const entityMatch = content.match(/@Entity\('([^']+)'\)/);
  if (!entityMatch) {
    console.log(`No @Entity found in: ${filePath}`);
    return;
  }
  
  const tableName = entityMatch[1];
  const entityName = path.basename(filePath, '.js');
  
  // Extract class name
  const classMatch = content.match(/export class (\w+)/);
  if (!classMatch) {
    console.log(`No class found in: ${filePath}`);
    return;
  }
  
  const className = classMatch[1];
  
  // Replace imports
  content = content.replace(
    /import { [^}]+ } from 'typeorm';/,
    "import { EntitySchema } from 'typeorm';"
  );
  
  // Remove all decorator imports and other imports
  content = content.replace(/import { [^}]+ } from '[^']+';/g, '');
  
  // Add EntitySchema import at the top
  content = `import { EntitySchema } from 'typeorm';\n\n` + content;
  
  // Extract constants (like Status enums)
  const constantsMatch = content.match(/(export const \w+ = \{[^}]+\};)/g);
  const constants = constantsMatch ? constantsMatch.join('\n') : '';
  
  // Remove constants from original content
  content = content.replace(/(export const \w+ = \{[^}]+\};)/g, '');
  
  // Create EntitySchema
  const schemaName = `${className}Schema`;
  const schemaDefinition = `export const ${schemaName} = new EntitySchema({
  name: '${className}',
  tableName: '${tableName}',
  columns: {
    // TODO: Add column definitions
  },
  relations: {
    // TODO: Add relation definitions
  }
});`;

  // Replace the entire class definition with the new format
  const classStartIndex = content.indexOf('@Entity(');
  const classEndIndex = content.lastIndexOf('}') + 1;
  
  if (classStartIndex !== -1 && classEndIndex !== -1) {
    const beforeClass = content.substring(0, classStartIndex);
    const afterClass = content.substring(classEndIndex);
    
    content = beforeClass + schemaDefinition + '\n\nexport class ' + className + ' {\n  constructor() {\n    // TODO: Initialize properties\n  }\n}' + afterClass;
  }
  
  // Write the converted content
  fs.writeFileSync(fullPath, content);
  console.log(`Converted: ${filePath}`);
}

// Convert all entity files
console.log('Starting entity conversion...');
entityFiles.forEach(convertEntityFile);
console.log('Entity conversion completed!');
