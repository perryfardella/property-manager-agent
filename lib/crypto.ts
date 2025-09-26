import { createCipheriv, createDecipheriv, randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

interface EncryptedData {
    encrypted: string;
    iv: string;
    salt: string;
}

/**
 * Encrypts sensitive data using AES-256-GCM encryption
 * @param text - The plaintext to encrypt
 * @param password - The encryption password (should be from environment variable)
 * @returns Object containing encrypted data, IV, and salt
 */
export async function encrypt(
    text: string,
    password: string,
): Promise<EncryptedData> {
    try {
        // Generate a random salt for this encryption
        const salt = randomBytes(16);

        // Derive key from password using scrypt
        const key = (await scryptAsync(password, salt, 32)) as Buffer;

        // Generate a random initialization vector
        const iv = randomBytes(16);

        // Create cipher
        const cipher = createCipheriv("aes-256-gcm", key, iv);

        // Encrypt the text
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");

        // Get the authentication tag
        const authTag = cipher.getAuthTag();

        // Combine encrypted data with auth tag
        const encryptedWithTag = encrypted + authTag.toString("hex");

        return {
            encrypted: encryptedWithTag,
            iv: iv.toString("hex"),
            salt: salt.toString("hex"),
        };
    } catch (error) {
        console.error("Encryption error:", error);
        throw new Error("Failed to encrypt data");
    }
}

/**
 * Decrypts data that was encrypted with the encrypt function
 * @param encryptedData - Object containing encrypted data, IV, and salt
 * @param password - The decryption password (same as used for encryption)
 * @returns The decrypted plaintext
 */
export async function decrypt(
    encryptedData: EncryptedData,
    password: string,
): Promise<string> {
    try {
        const { encrypted, iv, salt } = encryptedData;

        // Convert hex strings back to buffers
        const ivBuffer = Buffer.from(iv, "hex");
        const saltBuffer = Buffer.from(salt, "hex");

        // Derive the same key using the stored salt
        const key = (await scryptAsync(password, saltBuffer, 32)) as Buffer;

        // Extract auth tag from the end of encrypted data (last 32 hex chars = 16 bytes)
        const authTag = Buffer.from(encrypted.slice(-32), "hex");
        const encryptedText = encrypted.slice(0, -32);

        // Create decipher
        const decipher = createDecipheriv("aes-256-gcm", key, ivBuffer);
        decipher.setAuthTag(authTag);

        // Decrypt the text
        let decrypted = decipher.update(encryptedText, "hex", "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
    } catch (error) {
        console.error("Decryption error:", error);
        throw new Error("Failed to decrypt data");
    }
}

/**
 * Encrypts an access token for database storage
 * @param accessToken - The WhatsApp access token to encrypt
 * @returns Encrypted token data as JSON string
 */
export async function encryptAccessToken(accessToken: string): Promise<string> {
    const encryptionKey = process.env.ACCESS_TOKEN_ENCRYPTION_KEY;

    if (!encryptionKey) {
        throw new Error(
            "ACCESS_TOKEN_ENCRYPTION_KEY environment variable is required for token encryption",
        );
    }

    const encryptedData = await encrypt(accessToken, encryptionKey);
    return JSON.stringify(encryptedData);
}

/**
 * Decrypts an access token from database storage
 * @param encryptedTokenJson - The encrypted token data as JSON string
 * @returns The decrypted access token
 */
export async function decryptAccessToken(
    encryptedTokenJson: string,
): Promise<string> {
    const encryptionKey = process.env.ACCESS_TOKEN_ENCRYPTION_KEY;

    if (!encryptionKey) {
        throw new Error(
            "ACCESS_TOKEN_ENCRYPTION_KEY environment variable is required for token decryption",
        );
    }

    try {
        const encryptedData: EncryptedData = JSON.parse(encryptedTokenJson);
        return await decrypt(encryptedData, encryptionKey);
    } catch (error) {
        console.error("Failed to parse encrypted token data:", error);
        throw new Error("Invalid encrypted token format");
    }
}
