// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke.TransactionHistoryScreen.loading:invocation[0]': {
      type: 'done.invoke.TransactionHistoryScreen.loading:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.TransactionHistoryScreen.loading:invocation[0]': {
      type: 'error.platform.TransactionHistoryScreen.loading:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    loadTransactionHistory: 'done.invoke.TransactionHistoryScreen.loading:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  'eventsCausingActions': {
    setError: 'error.platform.TransactionHistoryScreen.loading:invocation[0]';
    setFilters: 'APPLY_FILTERS';
    setItems: 'done.invoke.TransactionHistoryScreen.loading:invocation[0]';
  };
  'eventsCausingServices': {
    loadTransactionHistory: 'REFRESH' | 'xstate.init';
  };
  'eventsCausingGuards': {};
  'eventsCausingDelays': {};
  'matchesStates': 'idle' | 'loading' | 'showingFilters';
  'tags': never;
}
