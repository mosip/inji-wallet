import React, {useContext} from 'react';
import {View} from 'react-native';
import {useCopilot, TooltipProps} from 'react-native-copilot';
import {Theme} from './../components/ui/styleUtils';
import {Text, Button, Row} from './../components/ui';
import {useTranslation} from 'react-i18next';
import {GlobalContext} from '../shared/GlobalContext';
import {AuthEvents} from '../machines/auth';

export const CopilotTooltip = ({labels}: TooltipProps, props) => {
  const {
    goToNext,
    goToPrev,
    stop,
    currentStep,
    isFirstStep,
    isLastStep,
    totalStepsNumber,
  } = useCopilot();

  const {t} = useTranslation();
  const {appService} = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const RESET_COPILOT = () =>
    authService?.send(AuthEvents.RESET_INITIAL_LAUNCH());

  const handleStop = async () => {
    RESET_COPILOT();
    stop();
  };

  const handleNext = () => {
    void goToNext();
  };

  const handlePrev = () => {
    void goToPrev();
  };

  return (
    <View style={Theme.CopilotTooltip.tooltipContainer}>
      <Text testID="stepTitle" weight="semibold" margin="0 0 10 0">
        {currentStep?.name}
      </Text>
      <Text testID="stepDescription">{currentStep?.text}</Text>
      <Row
        align="center"
        crossAlign="center"
        margin="25 0 0 0"
        style={{justifyContent: 'space-between'}}>
        <Text>{currentStep?.order + ' of ' + totalStepsNumber}</Text>
        <Row>
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
      </Row>
    </View>
  );
};
