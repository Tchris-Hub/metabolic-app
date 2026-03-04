# Implementation Plan

- [x] 1. Set up Supabase Edge Functions infrastructure



  - [x] 1.1 Create the call-service Edge Function


    - Create `supabase/functions/call-service/index.ts`
    - Implement request validation and service routing
    - Add encryption/decryption utilities
    - _Requirements: 4.1, 4.3, 5.4_

  - [x] 1.2 Implement YouTube API proxy in Edge Function
    - Add YouTube search endpoint handler
    - Add YouTube video details handler
    - Transform YouTube API responses
    - _Requirements: 2.2, 2.3, 2.4_
  - [x] 1.3 Implement Spoonacular API proxy in Edge Function
    - Add recipe search endpoint handler
    - Add random recipes handler
    - Transform Spoonacular API responses
    - _Requirements: 3.2, 3.3, 3.4_
  - [x] 1.4 Write property test for service routing



    - **Property 1: Service Routing**
    - **Validates: Requirements 2.2, 3.2, 4.1**

- [x] 2. Create database schema and encryption utilities


  - [x] 2.1 Create SQL migration for api_keys table

    - Add encrypted_key column
    - Add service and is_active columns
    - Create index for fast lookups
    - _Requirements: 1.1_
  - [x] 2.2 Create encryption utility script


    - Implement AES-256-GCM encryption
    - Create script to encrypt existing API keys
    - _Requirements: 1.1, 1.4_
  - [x] 2.3 Write property test for response transformation


    - **Property 2: Response Transformation**
    - **Validates: Requirements 2.3, 3.3**

- [x] 3. Update client-side services to use Edge Functions



  - [x] 3.1 Create SecureApiService for Edge Function calls

    - Implement `callService` method using `supabase.functions.invoke`
    - Add error handling and response parsing
    - _Requirements: 1.3, 5.3_

  - [x] 3.2 Update YouTubeService to use SecureApiService

    - Replace direct API calls with Edge Function calls
    - Maintain existing interface for backward compatibility
    - _Requirements: 2.1, 2.2_

  - [x] 3.3 Update Spoonacular/recipe service to use SecureApiService

    - Replace direct API calls with Edge Function calls
    - Update meal slice to use new service
    - _Requirements: 3.1, 3.2_

  - [x] 3.4 Write property test for error response structure

    - **Property 3: Error Response Structure**
    - **Validates: Requirements 2.4, 3.4, 5.2**





- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Update Learn and Meal tabs to use new services
  - [x] 5.1 Update Learn tab video loading

    - Use updated YouTubeService
    - Add error handling for Edge Function failures
    - _Requirements: 2.1, 5.3_

  - [x] 5.2 Update Meal tab recipe search
    - Use updated recipe service
    - Add error handling for Edge Function failures
    - _Requirements: 3.1, 5.3_

  - [x] 5.3 Write property test for request validation

    - **Property 4: Request Validation**
    - **Validates: Requirements 4.3, 5.4**

- [x] 6. Final Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.


- [x] 7. Write unit tests for secure API services


  - [x] 7.1 Test SecureApiService error handling


    - Test success responses
    - Test error responses
    - _Requirements: 5.2, 5.3_

  - [x] 7.2 Test YouTubeService integration

    - Test video search
    - Test health videos by category
    - _Requirements: 2.1, 2.2_
