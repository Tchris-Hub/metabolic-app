# Implementation Plan

- [x] 1. Add deep link handling for OAuth callbacks


















  - [x] 1.1 Create useDeepLinkHandler hook to listen for incoming URLs
    - Use expo-linking to subscribe to URL events
    - Parse OAuth callback URLs and extract session tokens
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 1.2 Update root _layout.tsx to initialize deep link handler
    - Import and call useDeepLinkHandler in the root layout
    - Handle initial URL on app launch
    - _Requirements: 2.3, 3.1_


  - [x] 1.3 Write property test for OAuth callback URL parsing





    - **Property 1: OAuth Callback URL Parsing**
    - **Validates: Requirements 1.2, 2.3**

- [x] 2. Enhance AuthService for Google Sign-In callback handling
  - [x] 2.1 Add handleOAuthCallback method to AuthService
    - Parse URL hash/query parameters for tokens
    - Call supabase.auth.setSession with extracted tokens
    - _Requirements: 1.2, 2.3_
  - [x] 2.2 Update AuthContext to expose callback handler
    - Add handleAuthCallback method to context
    - Update auth state after successful callback
    - _Requirements: 1.2, 1.5_
  - [x] 2.3 Write property test for redirect URI scheme consistency
    - **Property 2: Redirect URI Scheme Consistency**
    - **Validates: Requirements 2.1, 2.2, 5.2**

- [x] 3. Improve Google Sign-In UX on login screen
  - [x] 3.1 Add loading state during Google Sign-In flow
    - Show loading indicator when OAuth is in progress
    - Disable button during authentication
    - _Requirements: 3.2_
  - [x] 3.2 Improve error handling and user feedback
    - Handle user cancellation silently
    - Show appropriate error messages for failures
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 4. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Write unit tests for Google Sign-In
  - [x] 5.1 Test redirect URI generation
    - Verify URI scheme matches app.json scheme
    - _Requirements: 5.2_
  - [ ] 5.2 Test error message mapping

    - Verify correct messages for different error types
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
