import React, {useEffect} from 'react';
import {TextInput} from 'react-native';
import {usePinInput} from '../machines/pinInput';
import {Row} from './ui';
import {Theme} from './ui/styleUtils';

export const PinInput: React.FC<PinInputProps> = props => {
  const {state, send, events} = usePinInput(props.length);
  const {inputRefs, values} = state.context;
  const {UPDATE_INPUT, FOCUS_INPUT, KEY_PRESS} = events;

  useEffect(() => {
    if (props.onDone && values.filter(Boolean).length === inputRefs.length) {
      props.onDone(values.join(''));
    }
  }, [state]);

  return (
    <Row width="100%" testID={props.testID} removeClippedSubviews={true}>
      {inputRefs.map((input, index) => (
        <TextInput
          contextMenuHidden={true}
          selectTextOnFocus
          keyboardType="numeric"
          maxLength={1}
          secureTextEntry
          selectionColor={Theme.Colors.inputSelection}
          style={Theme.PinInputStyle.input}
          key={index}
          ref={input}
          value={values[index]}
          // KNOWN ISSUE: https://github.com/facebook/react-native/issues/19507
          onKeyPress={({nativeEvent}) => send(KEY_PRESS(nativeEvent.key))}
          onChangeText={(value: string) =>
            send(UPDATE_INPUT(value.replace(/\D/g, ''), index))
          }
          onFocus={() => send(FOCUS_INPUT(index))}
        />
      ))}
    </Row>
  );
};

interface PinInputProps {
  testID?: string;
  length: number;
  onDone?: (value: string) => void;
}
