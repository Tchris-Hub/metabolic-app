# Requirements Document

## Introduction

This feature implements secure API key management using Supabase Edge Functions for the Metabolic Health App. Currently, API keys are fetched from the database and used client-side to call external services (YouTube, Spoonacular). This approach exposes API keys to the client. The new architecture uses Edge Functions as a secure proxy - the client calls the Edge Function, which retrieves and decrypts the API key server-side, calls the external service, and returns the results. The API key never touches the client device.

## Glossary

- **Edge Function**: Serverless function running on Supabase's edge network, executed server-side
- **Service Role Key**: Supabase admin key with elevated privileges, used only server-side
- **API Key Encryption**: Process of encrypting sensitive API keys before storing in database
- **Proxy Pattern**: Design pattern where an intermediary handles requests on behalf of a client
- **MHA**: Metabolic Health App - the mobile application being developed
- **YouTube Data API**: Google's API for accessing YouTube video data
- **Spoonacular API**: Third-party API for recipe and nutrition data

## Requirements

### Requirement 1

**User Story:** As a developer, I want API keys to be stored securely and never exposed to the client, so that the keys cannot be extracted from the app.

#### Acceptance Criteria

1. THE MHA SHALL store API keys in an encrypted format in the Supabase database
2. THE MHA client SHALL NOT have direct access to decrypted API keys
3. WHEN the client needs external API data THEN the MHA SHALL route requests through Supabase Edge Functions
4. THE Edge Function SHALL use the service_role key to access encrypted API keys

### Requirement 2

**User Story:** As a user, I want to watch educational YouTube videos in the Learn tab, so that I can learn about managing my health.

#### Acceptance Criteria

1. WHEN a user opens the Learn tab THEN the MHA SHALL display YouTube video thumbnails and titles
2. WHEN the MHA requests YouTube videos THEN the Edge Function SHALL call the YouTube Data API with the decrypted key
3. WHEN the YouTube API returns results THEN the Edge Function SHALL return video data to the client
4. IF the YouTube API call fails THEN the Edge Function SHALL return an appropriate error response

### Requirement 3

**User Story:** As a user, I want to search for recipes in the Meal tab, so that I can find healthy meal options.

#### Acceptance Criteria

1. WHEN a user searches for recipes THEN the MHA SHALL send the query to the Edge Function
2. WHEN the Edge Function receives a recipe search request THEN the Edge Function SHALL call the Spoonacular API
3. WHEN the Spoonacular API returns results THEN the Edge Function SHALL return recipe data to the client
4. IF the Spoonacular API call fails THEN the Edge Function SHALL return an appropriate error response

### Requirement 4

**User Story:** As a developer, I want a unified Edge Function for external API calls, so that the codebase is maintainable.

#### Acceptance Criteria

1. THE Edge Function SHALL accept a service parameter to determine which external API to call
2. THE Edge Function SHALL support YouTube and Spoonacular services
3. THE Edge Function SHALL validate request parameters before making external calls
4. THE Edge Function SHALL handle rate limiting and quota errors gracefully

### Requirement 5

**User Story:** As a developer, I want the Edge Function to be testable and debuggable, so that I can ensure it works correctly.

#### Acceptance Criteria

1. THE Edge Function SHALL log errors for debugging purposes
2. THE Edge Function SHALL return structured error responses with error codes
3. WHEN the Edge Function is invoked THEN the MHA SHALL handle both success and error responses
4. THE Edge Function SHALL include request validation to prevent malformed requests
