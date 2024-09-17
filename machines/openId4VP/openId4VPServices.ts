import {__AppId} from '../../shared/GlobalVariables';
import {OpenID4VP} from '../../shared/openId4VP/OpenID4VP';

export const openId4VPServices = () => {
  const trustedVerifiersList = [
    {
      client_id: 'https://injiverify.dev2.mosip.net',
      response_uri: [
        'https://injiverify.qa-inji.mosip.net/redirect',
        'https://injiverify.dev2.mosip.net/redirect',
      ],
    },
    {
      client_id: 'https://injiverify.dev1.mosip.net',
      response_uri: [
        'https://injiverify.qa-inji.mosip.net/redirect',
        'https://injiverify.dev1.mosip.net/redirect',
      ],
    },
  ];
  return {
    getAuthenticationResponse: (context: any) => async () => {
      OpenID4VP.initialize();
      const serviceRes = await OpenID4VP.authenticateVerifier(
        context.encodedAuthorizationRequest,
        trustedVerifiersList,
      );
      return serviceRes;
    },

    sendVP: (context: any) => async () => {
      const vpToken = await OpenID4VP.constructVerifiablePresentationToken(
        context.selectedVCs,
      );
    },
  };
};
