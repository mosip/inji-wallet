import React from 'react';
import {View} from 'react-native';
import {useCopilot, TooltipProps} from 'react-native-copilot';
import {Theme} from './../components/ui/styleUtils';
import {Text, Button, Row} from './../components/ui';
import {useTranslation} from 'react-i18next';

export const CopilotTooltip = ({labels}: TooltipProps) => {
  const {goToNext, goToPrev, stop, currentStep, isFirstStep, isLastStep} =
    useCopilot();

  const {t} = useTranslation();

  const handleStop = () => {
    void stop();
  };
  const handleNext = () => {
    void goToNext();
  };

  const handlePrev = () => {
    void goToPrev();
  };

  return (
    <View style={Theme.CopilotTooltip.tooltipContainer}>
      <Text testID="stepTitle">{currentStep?.name}</Text>
      <Text testID="stepDescription">{currentStep?.text}</Text>
      <Row
        align="center"
        margin="10 0 0 0"
        style={{justifyContent: 'flex-end'}}>
        {!isFirstStep ? (
          <Button
            title={labels?.previous}
            type="outline"
            styles={{width: 104, height: 40}}
            onPress={handlePrev}
          />
        ) : null}
        {!isLastStep ? (
          <Button
            title={labels?.next}
            type="solid"
            styles={{width: 104, height: 40, marginLeft: 10}}
            onPress={handleNext}
          />
        ) : (
          <Button
            title={t('common:done')}
            type="solid"
            styles={{width: 104, height: 40, marginLeft: 10}}
            onPress={handleStop}
          />
        )}
      </Row>
    </View>
  );
};
