import { authorize } from 'react-native-app-auth';
import { EventFrom, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { request } from '../../shared/request';

const defaultIssuer = [
  {
    id: 'UIN, VID, AID',
    displayName: 'Enter the mentioned ID and download your card',
    logoUrl: '',
  },
];

const model = createModel(
  {
    issuers: defaultIssuer,
    selectedIssuer: [],
    tokenResponse: [],
  },
  {
    events: {
      DISMISS: () => ({}),
      DOWNLOAD_ID: () => ({}),
      SELECTED_ISSUER: (id: string) => ({ id }),
    },
  }
);

export const IssuerModelEvents = model.events;

export const IssuersMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEEIQGoGMCyB7CAhgDYB0BmmYADgC4CWAdlAJITMNUCuNJATmAwhhejKAGIASgFFkAEQCaiUFVyw69XAyUgAHogC0ARgAsATgDMJAEynjhgBzmArE-v2AbDYA0IAJ4GrAHZ3EkCnKxMrc0NDc1NAycAXySfVAwcfGIyCmp6JlZ2Lh4AM1xMTjUmMR1YGgIaMDISxt4ACkMABk6ASjF0rDxCUnJKWlFCjm4SMoqqqG0VNQ0tJF0DWM6QwOjXQydjYyDbH38EIycQM6PI6t7TsNTdxS0tEGskdzxgrYpnjoECIYDEzAAcgAFACqABUAPrMWSLVTqOiabR6c6GdxOQIkRydcJRQnudweU6IezGEjGezxKxRQJPTamV4gAaZYY5Mb5Fh-YokQHAsToZAAGURyBhUgRkNhyOWaNWoExRisLmsuPMgSCgUC8XM9gpCCCThI5huNkNpme2qc5jZHKG2VGeQm-OmQpBAGUpGKpABheGIuEwQQqQK1Hotaq-b2QwkTqmVzBTqBQnmdXGoyGKyheI6xnmYzmMmGR3vTku768yYCxgAN2IgNBcuDSLWS2jyvWWM6ZdCA6c6eMYQtuJz8WshuxHhcVkzDtS7KrzqPPdRU9DGbRFboolsilMvB0JhUZWGIMpcs1METHycSnWMxsfSdcZfM2pLFsNlYZOu3Jur824AruLYQGIvrkGCKyKG4aRl2KJXrGGyEp0JCmPeOKJPZbGu4pg4XSOp0qjgJKyK5Op8IE-Hy4F8GAACOnBwLyADyNBUGIECaE0Ta4AA1k09Fcq6TH1tM-AcVxoi8VQCAiZgDRKgA2p0AC6l5Kte-ZuNYpJ6par6XIExr2DYNI2bigRmDqJKAR8Um1lu-ysQpdRKXxYjCLwuC8CQVBEA0ZS8AAtiQkk1puYFefJnGUwymqbu5QaZo2l6ahioxiqBjxPYJAxFseZpnY0TGmYIROA43QPAOpkvHRa4MdJdYejQYiyMw3rYAN3r6YVfb6MY7jUtiWYllY7jYpE7jWWEZVPPcTILQ1FbtUBnUeWlfHgW255wtxMIQqNvZxnE1Iph4i4Wo8LXGqYhJJs1RwPj32udWG6gVAynHf1g3DVdhkXDsSYJJ0VhmAyDi0rVGopqYVLww8jkmMubx7VyyWKUwAb8EIDD0MQAlCYKmXibFHUExKW8iTkACBTRAZY2WUrLlEMYVi2LYfcxmDaJhklYxpdBaoSixE7gDjcxjJLtbnZITqVQKzZMcwFvBBSFYURcFMVxaQmss6T7N0MQXM81pun80VWKHImMS0sccPuHqUtIgMTBGVDKLvquLUcYKQrgwBwNo5uMd1LH8IIwiiM743YvqJBTQGZPDstJvv75zzZYYQKz9pYPG1ePqwDMk9TM5SVOnU9pDsR5kOA4pjirjzU4OZl6E4QzbdhpbH9wFdZ5DZAmAGdxqW1JRM4Nrat0JimMaTJkfSwTGDcWY7XX-2J3PO57oCJBgFFtBnMoaEGQLg7Hi9g6p49oq735jSzZT8jgEw1worSOatz6z0Sg2SC4IDN2ig0JeBhgj5hcIaTwnhUiNCXEseILQ2TcGEDMP5T6rnxvFQGskILXwQQAI3IOJQQKDzgkUTJmDwOJFY4gsMaEcpEGoPBMGObU7hojT32glZiXkmxQTYW-DwJAMEkOwejZGJdJpAO1HSQ4U1QFSPcjI2h3lmZSoIo8qH9nC0gahYBIpJiLahwgH25FXxxFrpQuF8YHcCsWQnOCN84GiLjmUs2wx5mGEdjIx1CmLA3FYzwpEggPEmgaMueCzj6jxJ7A4r4VbagfPEi2TMiba2tuTW2RArGTXzA4cWJIdieGlo8UqEQDgYPTAQspJBBIMEXu3dCLt9B0ksIrRwtgDi4RtO00scsDiHATCWDJZTAlBGCXnR4YSqQ5kEaPLphgdjpntFSKOSQgA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./issuersMachine.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      id: 'IssuerList',
      initial: 'displayIssuers',
      states: {
        displayIssuers: {
          invoke: {
            src: 'downloadIssuersList',
            onDone: {
              actions: ['setIssuers'],
              target: 'selectingIssuer',
            },
          },
        },
        selectingIssuer: {
          on: {
            DOWNLOAD_ID: {
              actions: 'forwardToParent',
              target: 'done',
            },
            SELECTED_ISSUER: {
              target: 'downloadIssuerConfig',
            },
          },
        },
        downloadIssuerConfig: {
          invoke: {
            src: 'downloadIssuerConfig',
            onDone: {
              actions: 'setSelectedIssuers',
              target: 'performAuthorization',
            },
          },
        },
        performAuthorization: {
          invoke: {
            src: 'invokeAuthorization',
            onDone: {
              actions: 'setTokenResponse',
              target: 'done',
            },
          },
        },
        done: {
          entry: () => console.log('Reached done'),
          type: 'final',
        },
      },
    },
    {
      actions: {
        forwardToParent: sendParent('DOWNLOAD_ID'),
        setIssuers: model.assign({
          issuers: (_, event) => event.data,
        }),

        setSelectedIssuers: model.assign({
          selectedIssuer: (_, event) => event.data,
        }),
        setTokenResponse: model.assign({
          tokenResponse: (_, event) => event.data,
        }),
      },

      services: {
        downloadIssuersList: async () => {
          const response = await request('GET', '/residentmobileapp/issuers');
          return [...defaultIssuer, ...response.response.issuers];
        },
        downloadIssuerConfig: async (_, event) => {
          const response = await request(
            'GET',
            `/residentmobileapp/issuers/${event.id}`
          );
          return response.response;
        },
        invokeAuthorization: async (context) => {
          console.log(
            'Response from Selected Issuer',
            JSON.stringify(context.selectedIssuer, null, 4)
          );
          const response = await authorize(context.selectedIssuer);
          console.log(response);
          return response?.response;
        },
      },
    }
  );

type State = StateFrom<typeof IssuersMachine>;
export function selectIssuers(state: State) {
  return state.context.issuers;
}

export function selectDisplayIssuers(state: State) {
  return state.matches('displayIssuers');
}
export function selectSelectingIssuers(state: State) {
  return state.matches('selectingIssuer');
}
export function selectSelectedIssuers(state: State) {
  return state.matches('selectedIssuers');
}
export function selectPerformAuthorization(state: State) {
  return state.matches('performAuthorization');
}
