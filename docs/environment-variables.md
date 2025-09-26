# Environment Variables Configuration

This document outlines the required environment variables for the WhatsApp Business API integration with encrypted access token storage.

## Required Environment Variables

### Supabase Configuration

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key
```

### Facebook/Meta WhatsApp Business API

```bash
# Backend API credentials
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Frontend configuration (must be prefixed with NEXT_PUBLIC_)
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_WHATSAPP_CONFIG_ID=your_whatsapp_embedded_signup_config_id
```

> **Note**: The `NEXT_PUBLIC_FACEBOOK_APP_ID` should be the same value as `FACEBOOK_APP_ID`. The `NEXT_PUBLIC_WHATSAPP_CONFIG_ID` is obtained from your Facebook App's WhatsApp Business API embedded signup configuration.

### Access Token Encryption (REQUIRED FOR SECURITY)

```bash
ACCESS_TOKEN_ENCRYPTION_KEY=your_32_plus_character_encryption_key_here
```

## Generating a Secure Encryption Key

The `ACCESS_TOKEN_ENCRYPTION_KEY` must be a strong, random string of at least 32 characters. You can generate one using:

```bash
# Generate a secure 32-byte key encoded in base64
openssl rand -base64 32
```

Example output:

```
wX8L+Gqh4fp6LhHrPXOPMBRXhPXOPMBRXhPXOPMBRX=
```

## Security Considerations

1. **Never commit the actual encryption key to version control**
2. **Use different encryption keys for different environments** (development, staging, production)
3. **Store the encryption key securely** (e.g., in your hosting platform's environment variable system)
4. **If you lose the encryption key, all stored access tokens will become unrecoverable**
5. **Consider implementing key rotation policies** for production environments

## Usage

The encryption key is used to:

- Encrypt WhatsApp access tokens before storing them in the database
- Decrypt access tokens when making API calls to WhatsApp Business API
- Ensure that even if the database is compromised, access tokens remain secure

## Testing

For development/testing purposes, you can use a simple key, but **never use test keys in production**:

```bash
# Development only - DO NOT use in production
ACCESS_TOKEN_ENCRYPTION_KEY=development_key_32_characters_long
```
