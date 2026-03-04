# Requirements Document

## Introduction

This feature enables Google Sign-In authentication for the Metabolic Health App (MHA). The app uses Expo with Supabase as the backend. Google Sign-In provides users with a convenient, secure way to authenticate without creating a separate password. The implementation must handle the OAuth flow properly on both iOS and Android platforms, including deep linking back to the app after authentication.

## Glossary

- **MHA**: Metabolic Health App - the mobile application being developed
- **Supabase**: Backend-as-a-Service platform providing authentication and database services
- **OAuth**: Open Authorization protocol used for token-based authentication
- **Deep Link**: A URL that navigates directly to a specific location within a mobile app
- **Redirect URI**: The URL where the OAuth provider sends the user after authentication
- **Google Cloud Console**: Google's platform for managing OAuth credentials and API access
- **Expo**: React Native framework used to build the mobile app
- **WebBrowser**: Expo module for opening authentication sessions in a secure browser

## Requirements

### Requirement 1

**User Story:** As a user, I want to sign in with my Google account, so that I can access the app without creating a separate password.

#### Acceptance Criteria

1. WHEN a user taps the "Continue with Google" button THEN the MHA SHALL open a secure browser session to Google's OAuth consent screen
2. WHEN Google authentication succeeds THEN the MHA SHALL receive the OAuth callback and establish a user session
3. WHEN Google authentication fails or is cancelled THEN the MHA SHALL display an appropriate error message and return to the login screen
4. WHEN a user signs in with Google for the first time THEN the MHA SHALL create a new user account linked to the Google identity
5. WHEN a user signs in with Google using an existing account THEN the MHA SHALL restore the existing user session and data

### Requirement 2

**User Story:** As a developer, I want the Google Sign-In to work on both iOS and Android, so that all users can authenticate regardless of platform.

#### Acceptance Criteria

1. WHEN the app runs on iOS THEN the MHA SHALL use the correct redirect URI scheme for iOS deep linking
2. WHEN the app runs on Android THEN the MHA SHALL use the correct redirect URI scheme for Android deep linking
3. WHEN the OAuth callback is received THEN the MHA SHALL parse the authentication tokens from the redirect URL
4. WHEN the app is built with EAS Build THEN the MHA SHALL include the native deep link configuration in the build

### Requirement 3

**User Story:** As a user, I want the Google Sign-In process to be seamless, so that I can quickly access the app.

#### Acceptance Criteria

1. WHEN the OAuth browser session completes THEN the MHA SHALL automatically close the browser and return to the app
2. WHEN authentication is in progress THEN the MHA SHALL display a loading indicator
3. WHEN the user is authenticated THEN the MHA SHALL navigate to the main app screen within 2 seconds
4. WHEN the authentication session expires THEN the MHA SHALL prompt the user to re-authenticate

### Requirement 4

**User Story:** As a developer, I want proper error handling for Google Sign-In, so that users understand what went wrong.

#### Acceptance Criteria

1. IF the user cancels the Google Sign-In flow THEN the MHA SHALL return to the login screen without showing an error
2. IF Google's OAuth service is unavailable THEN the MHA SHALL display a network error message
3. IF the redirect URI is misconfigured THEN the MHA SHALL log the error for debugging purposes
4. IF the Supabase session exchange fails THEN the MHA SHALL display an authentication error message

### Requirement 5

**User Story:** As a developer, I want the Google Sign-In configuration to be maintainable, so that credentials can be updated without code changes.

#### Acceptance Criteria

1. THE MHA SHALL store Google OAuth client IDs in environment variables
2. THE MHA SHALL use the app scheme defined in app.json for redirect URIs
3. WHEN environment variables are missing THEN the MHA SHALL provide clear error messages during development
4. THE MHA SHALL document the required Supabase and Google Cloud Console configuration steps
