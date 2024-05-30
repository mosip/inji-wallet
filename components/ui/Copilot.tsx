import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {CopilotStep, walkthroughable} from 'react-native-copilot';

export const Copilot: React.FC<CopilotProps> = (props: CopilotProps) => {
  const CopilotView = walkthroughable(View);
  return (
    <CopilotStep
      name={props.title}
      text={props.description}
      order={props.order}>
      <CopilotView style={props.targetStyle ? props.targetStyle : null}>
        {props.children}
      </CopilotView>
    </CopilotStep>
  );
};

interface CopilotProps {
  title: string;
  description: string;
  order: number;
  targetStyle?: StyleProp<ViewStyle>;
  children: React.ReactElement;
}
