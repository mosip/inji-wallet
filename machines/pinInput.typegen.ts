// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'xstate.after(INITIAL_FOCUS_DELAY)#pinInput.idle': {
      type: 'xstate.after(INITIAL_FOCUS_DELAY)#pinInput.idle';
    };
    'xstate.init': { type: 'xstate.init' };
    '': { type: '' };
  };
  'invokeSrcNameMap': {};
  'missingImplementations': {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  'eventsCausingActions': {
    selectInput: 'FOCUS_INPUT';
    updateInput: 'UPDATE_INPUT';
    focusSelected:
      | 'xstate.after(INITIAL_FOCUS_DELAY)#pinInput.idle'
      | 'UPDATE_INPUT'
      | 'KEY_PRESS';
    selectNextInput: 'UPDATE_INPUT';
    selectPrevInput: 'KEY_PRESS';
    clearInput: 'KEY_PRESS';
  };
  'eventsCausingServices': {};
  'eventsCausingGuards': {
    isBlank: 'UPDATE_INPUT';
    hasNextInput: 'UPDATE_INPUT';
    canGoBack: 'KEY_PRESS';
  };
  'eventsCausingDelays': {
    INITIAL_FOCUS_DELAY: 'xstate.init' | '';
  };
  'matchesStates': 'idle' | 'selectingNext' | 'selectingPrev';
  'tags': never;
}
