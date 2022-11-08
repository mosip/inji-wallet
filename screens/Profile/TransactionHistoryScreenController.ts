import { useInterpret, useSelector } from '@xstate/react';
import { useRef } from 'react';
import { assign, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { request } from '../../shared/request';

export function useTransactionHistoryScreen() {
  const machine = useRef(TransactionHistoryScreenMachine);
  const service = useInterpret(machine.current, { devTools: __DEV__ });

  return {
    transactionHistory: useSelector(service, selectTransactionHistory),

    isLoading: useSelector(service, selectIsLoading),
    isShowingFilters: useSelector(service, selectIsShowingFilters),

    REFRESH: () => service.send(TransactionHistoryScreenEvents.REFRESH()),
    CANCEL: () => service.send(TransactionHistoryScreenEvents.CANCEL()),
    SHOW_FILTERS: () =>
      service.send(TransactionHistoryScreenEvents.SHOW_FILTERS()),
    APPLY_FILTERS: (filters: TransactionHistoryFilters) =>
      service.send(TransactionHistoryScreenEvents.APPLY_FILTERS(filters)),
  };
}

const model = createModel(
  {
    items: [] as MOSIPServiceHistoryItem[],
    error: '',
    filters: {
      pageStart: 0,
      pageFetch: 50,
      searchText: '',
      sortType: 'DESC',
    } as TransactionHistoryFilters,
  },
  {
    events: {
      REFRESH: () => ({}),
      CANCEL: () => ({}),
      SHOW_FILTERS: () => ({}),
      APPLY_FILTERS: (filters: TransactionHistoryFilters) => ({ filters }),
    },
  }
);

export const TransactionHistoryScreenEvents = model.events;

export const TransactionHistoryScreenMachine = model.createMachine(
  {
    tsTypes:
      {} as import('./TransactionHistoryScreenController.typegen').Typegen0,
    id: 'TransactionHistoryScreen',
    context: model.initialContext,
    schema: {
      services: {} as {
        loadTransactionHistory: {
          data: MOSIPServiceHistoryItem[];
        };
      },
    },
    initial: 'loading',
    states: {
      loading: {
        invoke: {
          src: 'loadTransactionHistory',
          onDone: {
            target: 'idle',
            actions: 'setItems',
          },
          onError: {
            target: 'idle',
            actions: 'setError',
          },
        },
      },
      idle: {
        on: {
          REFRESH: {
            target: 'loading',
          },
          SHOW_FILTERS: {
            target: 'showingFilters',
          },
        },
      },
      showingFilters: {
        on: {
          CANCEL: {
            target: 'idle',
          },
          APPLY_FILTERS: {
            actions: 'setFilters',
            target: 'idle',
          },
        },
      },
    },
  },
  {
    actions: {
      setItems: assign({
        items: (_context, event) => event.data,
      }),

      setError: assign({
        error: (_context, event) => (event.data as Error).message,
      }),

      setFilters: assign({
        filters: (_context, event) => event.filters,
      }),
    },

    services: {
      loadTransactionHistory: (context) => async () => {
        const langCode = 'en-US';
        console.log('a');
        const query = toQueryParams(context.filters);
        console.log('b', query);

        const response = await request(
          'GET',
          `/req/service-history/${langCode}?${query}`
        );

        console.log('c', response);

        return response.response.data;
      },
    },
  }
);

type State = StateFrom<typeof TransactionHistoryScreenMachine>;

function selectTransactionHistory(state: State) {
  return state.context.items;
}

function selectIsLoading(state: State) {
  return state.matches('loading');
}

function selectIsShowingFilters(state: State) {
  return state.matches('showingFilters');
}

export interface MOSIPServiceHistoryItem {
  eventId: string;
  description: string;
  eventStatus: MOSIPServiceHistoryItemEventStatus;
  timeStamp: string; // JSON Date
  requestType: string;
}

export enum MOSIPServiceHistoryItemEventStatus {
  Success = 'Success',
  Failed = 'Failed',
  InProgress = 'In-Progress',
}

export enum MOSIPServiceHistoryItemType {
  All = 'ALL',
  AuthenticationRequest = 'AUTHENTICATION_REQUEST',
  ServiceRequest = 'SERVICE_REQUEST',
  DataUpdateRequest = 'DATA_UPDATE_REQUEST',
  IdManagementRequest = 'ID_MANAGEMENT_REQUEST',
  DataShareRequest = 'DATA_SHARE_REQUEST',
}

export interface TransactionHistoryFilters {
  fromDateTime?: string;
  toDateTime?: string;
  pageFetch?: number;
  pageStart?: number;
  searchText?: string;
  serviceType?: MOSIPServiceHistoryItemType;
  sortType?: 'ASC' | 'DESC';
  [key: string]: unknown;
}

function toQueryParams(queryObj: Record<string, unknown>) {
  return Object.entries(queryObj)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}
