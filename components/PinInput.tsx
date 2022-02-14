import React, { useEffect } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { usePinInput } from '../machines/pinInput';
import { Row } from './ui';
import { Colors } from './ui/styleUtils';

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderColor: Colors.Grey,
    color: Colors.Black,
    flex: 1,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    fontWeight: '600',
    height: 40,
    lineHeight: 28,
    margin: 8,
    textAlign: 'center',
  },
});

export const PinInput: React.FC<PinInputProps> = (props) => {
  const { state, send, events } = usePinInput(props.length);
  const { inputRefs, values } = state.context;
  const { UPDATE_INPUT, FOCUS_INPUT, KEY_PRESS } = events;

  useEffect(() => {
    if (props.onDone && values.filter(Boolean).length === inputRefs.length) {
      props.onDone(values.join(''));
    }
  }, [state]);

  return (
    <Row width="100%">
      {inputRefs.map((input, index) => (
        <TextInput
          selectTextOnFocus
          keyboardType="numeric"
          maxLength={1}
          selectionColor={Colors.Orange}
          style={styles.input}
          key={index}
          ref={input}
          value={values[index]}
          // KNOWN ISSUE: https://github.com/facebook/react-native/issues/19507
          onKeyPress={({ nativeEvent }) => send(KEY_PRESS(nativeEvent.key))}
          onChangeText={(value: string) =>
            send(UPDATE_INPUT(value.replace(/[^0-9]/g, ''), index))
          }
          onFocus={() => send(FOCUS_INPUT(index))}
        />
      ))}
    </Row>
  );
};

interface PinInputProps {
  length: number;
  onDone?: (value: string) => void;
}
