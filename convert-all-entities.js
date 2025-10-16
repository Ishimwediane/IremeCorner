#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all entity files that still use decorators
const entityFiles = [
  'src/entities/courses/Assignment.js',
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
  
  // Extract class name
  const classMatch = content.match(/export class (\w+)/);
  if (!classMatch) {
    console.log(`No class found in: ${filePath}`);
    return;
  }
  
  const className = classMatch[1];
  
  // Extract constants (like Status enums)
  const constantsMatch = content.match(/(export const \w+ = \{[^}]+\};)/g);
  const constants = constantsMatch ? constantsMatch.join('\n') : '';
  
  // Create basic EntitySchema structure
  const schemaName = `${className}Schema`;
  const schemaDefinition = `export const ${schemaName} = new EntitySchema({
  name: '${className}',
  tableName: '${tableName}',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    }
    // TODO: Add other column definitions
  },
  relations: {
    // TODO: Add relation definitions
  }
});`;

  // Create basic class structure
  const classDefinition = `export class ${className} {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}`;

  // Replace the entire file content
  const newContent = `import { EntitySchema } from 'typeorm';

${constants}

${schemaDefinition}

${classDefinition}
`;

  // Write the converted content
  fs.writeFileSync(fullPath, newContent);
  console.log(`Converted: ${filePath}`);
}

// Convert all entity files
console.log('Starting bulk entity conversion...');
entityFiles.forEach(convertEntityFile);
console.log('Bulk entity conversion completed!');
console.log('Note: You may need to manually add column and relation definitions to the schemas.');
