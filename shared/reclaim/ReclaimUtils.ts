import {Linking} from 'react-native';
import {ReclaimProofRequest, Proof} from '@reclaimprotocol/reactnative-sdk';
import {request} from '../request';

// Check if an issuer is a Reclaim Protocol issuer
export const isReclaimIssuer = (issuerId: string): boolean => {
  return issuerId.toLowerCase() === 'reclaimprotocol';
};

const RECLAIM_CONFIG_URL = 'https://inji.reclaimprotocol.org/config/inji';
const RECLAIM_SESSION_URL = 'https://api.reclaimprotocol.org/api/sdk/session';
const RECLAIM_CREDENTIAL_URL = 'https://vc.reclaimprotocol.org';

// Initialize the Reclaim proof request
const initializeReclaimProofRequest = async (
  selectedCredentialType: string,
) => {
  try {
    // make an api call to get config
    const response = await request('POST', RECLAIM_CONFIG_URL, {
      selectedCredentialType: selectedCredentialType,
    });

    if (response.reclaimProofRequestConfig) {
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(
        response.reclaimProofRequestConfig,
      );

      return reclaimProofRequest;
    } else {
      throw new Error(
        `Failed to fetch reclaim proof request config for credential type: ${selectedCredentialType}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    }
  } catch (error) {
    console.error(
      `Error initializing Reclaim proof request for credential type: ${selectedCredentialType}:`,
      error,
    );
    throw new Error(
      `Failed to initialize Reclaim proof request: ${
        error.message || 'Unknown error'
      }`,
    );
  }
};

// Generate a request URL for the Reclaim proof request
const generateReclaimRequestUrl = async (
  reclaimProofRequest: any,
): Promise<{url: string; sessionId: string}> => {
  try {
    const reclaimProofRequestConfigString = reclaimProofRequest.toJsonString();
    const reclaimProofRequestConfigObject = JSON.parse(
      reclaimProofRequestConfigString,
    );
    const sessionId = reclaimProofRequestConfigObject.sessionId;

    const url = await reclaimProofRequest.getRequestUrl();
    return {url, sessionId};
  } catch (error) {
    console.error('[Reclaim] Error generating Reclaim request URL:', error);
    throw new Error(
      `Failed to generate Reclaim request URL: ${
        error.message || 'Unknown error'
      }. Session ID: ${error.sessionId || 'Not available'}`,
    );
  }
};

// Parse the deeplink URL to extract the session ID
const parseReclaimDeepLinkURL = (url: string) => {
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
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`[Reclaim] Error parsing deep link URL: ${url}`, error);
    return null;
  }
};

// Wait for deeplink with timeout
const waitForReclaimDeeplink = (sessionId: string): Promise<void> => {
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
          `RECLAIM_TIMEOUT: Timed out waiting for Reclaim verification after 7 minutes. Session ID: ${sessionId}`,
        ),
      );
    }, 7 * 60 * 1000); // 7 minutes

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
        resolve();
        return true;
      }
      cleanup();
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
    const response = await request(
      'GET',
      `${RECLAIM_SESSION_URL}/${sessionId}`,
    );

    if (
      response.session &&
      response.session.proofs &&
      response.session.proofs.length > 0
    ) {
      return response.session.proofs;
    } else {
      throw new Error(
        `Failed to fetch proof data for session ID: ${sessionId}. Response: ${JSON.stringify(
          response,
        )}`,
      );
    }
  } catch (error) {
    console.error(
      `Error fetching proof data for session ID: ${sessionId}:`,
      error,
    );
    throw new Error(
      `Failed to fetch proof data: ${error.message || 'Unknown error'}`,
    );
  }
};

// Call a backend service to convert Reclaim proof to OpenID4VC format
const convertReclaimProofToCredential = async (
  proofs: Proof[],
  selectedCredentialType: string,
): Promise<any> => {
  try {
    const response = await request(
      'POST',
      `/credential`,
      {
        proofs: proofs,
        selectedCredentialType: selectedCredentialType,
      },
      RECLAIM_CREDENTIAL_URL,
      {
        'Content-Type': 'application/json',
      },
    );

    return response;
  } catch (error) {
    console.error(
      `Error converting Reclaim proof to credential for type: ${selectedCredentialType}:`,
      error,
    );
    throw new Error(
      `Failed to convert Reclaim proof to credential: ${
        error.message || 'Unknown error'
      }`,
    );
  }
};

// Main function to handle the entire Reclaim flow with timeout
export const handleReclaimFlow = async (
  selectedCredentialType: string,
): Promise<any> => {
  try {
    // Initialize Reclaim
    const reclaimProofRequest = await initializeReclaimProofRequest(
      selectedCredentialType,
    );

    // Generate request URL and get sessionId
    const {url: requestUrl, sessionId} = await generateReclaimRequestUrl(
      reclaimProofRequest,
    );

    // Open the URL in the browser
    await Linking.openURL(requestUrl);

    // Wait for the deeplink callback (with 7-minute timeout)
    await waitForReclaimDeeplink(sessionId);

    // Now that we have confirmation via deeplink, fetch the proof data
    const proofData = await fetchProofData(sessionId);

    // Convert the proof to a verifiable credential format
    const credential = await convertReclaimProofToCredential(
      proofData,
      selectedCredentialType,
    );

    return credential;
  } catch (error) {
    console.error(
      `[Reclaim] Error in Reclaim flow for credential type: ${selectedCredentialType}:`,
      error,
    );
    // Rethrow with a specific prefix to identify timeout errors
    if (error.message?.includes('RECLAIM_TIMEOUT')) {
      throw new Error(
        `RECLAIM_TIMEOUT: Verification process timed out for credential type: ${selectedCredentialType}. Please try again.`,
      );
    }
    throw new Error(`Reclaim flow failed: ${error.message || 'Unknown error'}`);
  }
};
