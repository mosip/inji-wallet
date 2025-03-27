import {Linking} from 'react-native';

// Import the Reclaim SDK (adjust the import path as needed)
import {
  ReclaimProofRequest,
  Proof,
  ProviderClaimData,
} from '@reclaimprotocol/reactnative-sdk';

// Check if an issuer is a Reclaim Protocol issuer
export const isReclaimIssuer = (issuerId: string): boolean => {
  return issuerId.toLowerCase() === 'reclaimprotocol';
};

const RECLAIM_CONFIG_URL = 'https://inji.reclaimprotocol.org/config/inji';
const RECLAIM_SESSION_URL = 'https://api.reclaimprotocol.org/api/sdk/session';
const RECLAIM_CREDENTIAL_URL = 'https://vc.reclaimprotocol.org/credential';

// Initialize the Reclaim proof request
export const initializeReclaimProofRequest = async (credentialType: string) => {
  try {
    // make an api call to get config
    const response = await fetch(RECLAIM_CONFIG_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({selectedCredentialType: credentialType}),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch config');
    }

    const {reclaimProofRequestConfig} = await response.json();
    const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(
      reclaimProofRequestConfig,
    );

    return reclaimProofRequest;
  } catch (error) {
    console.error('Error initializing Reclaim proof request:', error);
    throw error;
  }
};

// Generate a request URL for the Reclaim proof request
export const generateReclaimRequestUrl = async (
  reclaimProofRequest: any,
): Promise<{url: string; sessionId: string}> => {
  try {
    const jsonString = reclaimProofRequest.toJsonString();
    const jsonObject = JSON.parse(jsonString);
    const sessionId = jsonObject.sessionId;

    const url = await reclaimProofRequest.getRequestUrl();
    return {url, sessionId};
  } catch (error) {
    console.error('[Reclaim] Error generating Reclaim request URL:', error);
    throw error;
  }
};

// Parse the deeplink URL to extract the session ID
export const parseReclaimDeepLinkURL = (url: string) => {
  try {
    // Check if this is a reclaim-callback deep link
    if (url.includes('mosipreclaim://callback')) {
      // Parse the query parameters
      const urlObj = new URL(url);
      const searchParams = new URLSearchParams(urlObj.search);
      const sessionId = searchParams.get('sessionId');

      if (sessionId) {
        return {
          sessionId,
          fullUrl: url,
        };
      }

      // Fallback to manual parsing if URL class fails
      const parts = url.split('?');
      if (parts.length >= 2) {
        const queryString = parts[1];
        const params = new URLSearchParams(queryString);
        const sessionId = params.get('sessionId');

        if (sessionId) {
          return {
            sessionId,
            fullUrl: url,
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('[Reclaim] Error parsing deep link URL:', error);
    return null;
  }
};

// Wait for deeplink with timeout
export const waitForReclaimDeeplink = (
  sessionId: string,
  timeoutMinutes = 5,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let linkingSubscription: any = null;
    let timeoutId: NodeJS.Timeout;

    // Set timeout (5 minutes by default)
    timeoutId = setTimeout(() => {
      if (linkingSubscription) {
        linkingSubscription.remove();
      }
      reject(
        new Error(
          'RECLAIM_TIMEOUT: Timed out waiting for Reclaim verification',
        ),
      );
    }, timeoutMinutes * 60 * 1000);

    // Function to clean up listeners
    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (linkingSubscription) linkingSubscription.remove();
    };

    // Process a URL to check if it matches our expected deeplink
    const processUrl = (url: string | null) => {
      if (!url) return false;

      // Parse the URL to check if it's a Reclaim deeplink
      const parsedData = parseReclaimDeepLinkURL(url);
      if (parsedData && parsedData.sessionId === sessionId) {
        cleanup();
        resolve(sessionId);
        return true;
      }

      return false;
    };

    // Handle initial URL (app might have been opened via deep link)
    Linking.getInitialURL().then(url => {
      processUrl(url);
    });

    // Listen for deep links when app is already running
    linkingSubscription = Linking.addEventListener('url', ({url}) => {
      processUrl(url);
    });
  });
};

// Fetch proof data using the session ID
export const fetchProofData = async (sessionId: string): Promise<Proof[]> => {
  try {
    const response = await fetch(`${RECLAIM_SESSION_URL}/${sessionId}`);
    const data = await response.json();
    if (response.ok) {
      if (data.session.proofs.length > 0) {
        return data.session.proofs;
      } else {
        throw new Error('Failed to fetch proof data');
      }
    } else {
      throw new Error('Failed to fetch proof data');
    }
  } catch (error) {
    console.error('Error fetching proof data:', error);
    throw error;
  }
};

// Call a backend service to convert Reclaim proof to OpenID4VC format
const convertReclaimProofToCredential = async (
  proofs: Proof[],
  selectedCredential: string,
): Promise<any> => {
  try {
    // POST request to the Reclaim credential endpoint
    const stringifiedProofs = JSON.stringify({
      proofs: proofs,
      selectedCredentialType: selectedCredential,
    });
    const apiKey = 'test-reclaim-token';
    const response = await fetch(RECLAIM_CREDENTIAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: stringifiedProofs,
    });

    if (!response.ok) {
      throw new Error('Failed to convert Reclaim proof to credential');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error converting Reclaim proof to credential:', error);
    throw error;
  }
};

// Main function to handle the entire Reclaim flow with timeout
export const handleReclaimFlow = async (
  selectedCredential: string,
): Promise<any> => {
  try {
    // Initialize Reclaim
    const reclaimProofRequest = await initializeReclaimProofRequest(
      selectedCredential,
    );

    // Generate request URL and get sessionId
    const {url: requestUrl, sessionId} = await generateReclaimRequestUrl(
      reclaimProofRequest,
    );

    // Open the URL in the browser
    await Linking.openURL(requestUrl);

    // Wait for the deeplink callback (with 5-minute timeout)
    await waitForReclaimDeeplink(sessionId);

    // Now that we have confirmation via deeplink, fetch the proof data
    const proofData = await fetchProofData(sessionId);

    // Convert the proof to a verifiable credential format
    const credential = await convertReclaimProofToCredential(
      proofData,
      selectedCredential,
    );

    return credential;
  } catch (error) {
    console.error('[Reclaim] Error in Reclaim flow:', error);
    // Rethrow with a specific prefix to identify timeout errors
    if (error.message?.includes('RECLAIM_TIMEOUT')) {
      throw new Error(
        'RECLAIM_TIMEOUT: Verification process timed out. Please try again.',
      );
    }
    throw error;
  }
};
