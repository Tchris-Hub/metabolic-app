/**
 * Encryption Utility Script for API Keys
 * 
 * This script encrypts API keys using AES-256-GCM before storing them in the database.
 * The encrypted format is: iv:authTag:encryptedData (all in hex)
 * 
 * Usage:
 *   npx ts-node scripts/encrypt-api-key.ts <api-key> <encryption-key-hex>
 * 
 * Example:
 *   npx ts-node scripts/encrypt-api-key.ts "your-api-key" "your-32-byte-hex-key"
 * 
 * To generate a 32-byte encryption key:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 * 
 * _Requirements: 1.1, 1.4_
 */

import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Encrypts a plaintext string using AES-256-GCM
 * @param plaintext - The API key to encrypt
 * @param keyHex - The 32-byte encryption key in hex format (64 characters)
 * @returns Encrypted string in format: iv:authTag:encryptedData (all hex)
 */
export function encrypt(plaintext: string, keyHex: string): string {
  // Validate key length (32 bytes = 64 hex characters)
  if (keyHex.length !== 64) {
    throw new Error('Encryption key must be 32 bytes (64 hex characters)');
  }

  const key = Buffer.from(keyHex, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts an encrypted string using AES-256-GCM
 * @param encryptedData - The encrypted string in format: iv:authTag:encryptedData
 * @param keyHex - The 32-byte encryption key in hex format
 * @returns Decrypted plaintext string
 */
export function decrypt(encryptedData: string, keyHex: string): string {
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format. Expected iv:authTag:encryptedData');
  }

  const [ivHex, authTagHex, encrypted] = parts;
  
  const key = Buffer.from(keyHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Generates a new 32-byte encryption key
 * @returns Hex-encoded 32-byte key
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
API Key Encryption Utility

Usage:
  npx ts-node scripts/encrypt-api-key.ts encrypt <api-key> <encryption-key-hex>
  npx ts-node scripts/encrypt-api-key.ts decrypt <encrypted-data> <encryption-key-hex>
  npx ts-node scripts/encrypt-api-key.ts generate-key

Commands:
  encrypt      Encrypt an API key
  decrypt      Decrypt an encrypted API key (for verification)
  generate-key Generate a new 32-byte encryption key

Examples:
  # Generate a new encryption key
  npx ts-node scripts/encrypt-api-key.ts generate-key

  # Encrypt an API key
  npx ts-node scripts/encrypt-api-key.ts encrypt "AIzaSyB..." "your-64-char-hex-key"

  # Decrypt to verify
  npx ts-node scripts/encrypt-api-key.ts decrypt "iv:tag:data" "your-64-char-hex-key"
`);
    process.exit(0);
  }

  const command = args[0];

  try {
    switch (command) {
      case 'generate-key': {
        const key = generateEncryptionKey();
        console.log('\nGenerated Encryption Key (store this securely!):');
        console.log(key);
        console.log('\nKey length:', key.length, 'characters (32 bytes)');
        break;
      }

      case 'encrypt': {
        if (args.length < 3) {
          console.error('Error: Missing arguments. Usage: encrypt <api-key> <encryption-key-hex>');
          process.exit(1);
        }
        const apiKey = args[1];
        const encryptionKey = args[2];
        const encrypted = encrypt(apiKey, encryptionKey);
        console.log('\nEncrypted API Key:');
        console.log(encrypted);
        console.log('\nStore this value in the encrypted_key column of your api_keys table.');
        break;
      }

      case 'decrypt': {
        if (args.length < 3) {
          console.error('Error: Missing arguments. Usage: decrypt <encrypted-data> <encryption-key-hex>');
          process.exit(1);
        }
        const encryptedData = args[1];
        const encryptionKey = args[2];
        const decrypted = decrypt(encryptedData, encryptionKey);
        console.log('\nDecrypted API Key:');
        console.log(decrypted);
        break;
      }

      default:
        console.error(`Unknown command: ${command}`);
        console.log('Use --help for usage information.');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}
