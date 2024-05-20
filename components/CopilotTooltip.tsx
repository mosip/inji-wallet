import React, {useContext} from 'react';
import {useCopilot, TooltipProps} from 'react-native-copilot';
import {Text, Button, Row, Column} from './../components/ui';
import {useTranslation} from 'react-i18next';
import {GlobalContext} from '../shared/GlobalContext';
import {AuthEvents, selectIsInitialDownload} from '../machines/auth';
import {useSelector} from '@xstate/react';

export const CopilotTooltip = ({labels}: TooltipProps, props) => {
  const {
    goToNext,
    goToPrev,
    stop,
    currentStep,
    isFirstStep,
    isLastStep,
    totalStepsNumber,
    copilotEvents,
  } = useCopilot();

  const {t} = useTranslation();
  const {appService} = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const ONBOARDING_DONE = () => authService?.send(AuthEvents.ONBOARDING_DONE());
  const INITIAL_DOWNLOAD_DONE = () =>
    authService?.send(AuthEvents.INITIAL_DOWNLOAD_DONE());
  const isInitialDownloading = useSelector(
    authService,
    selectIsInitialDownload,
  );
  const handleStop = async () => {
    stop();
  };

  const handleNext = () => {
    void goToNext();
  };

  const handlePrev = () => {
    void goToPrev();
  };

  copilotEvents.on('stop', () => {
    if (currentStep?.order <= 5) {
      ONBOARDING_DONE();
    }
    if (currentStep?.order === 6) {
      INITIAL_DOWNLOAD_DONE();
    }
  });

  return (
    <Column>
      <Text testID="stepTitle" weight="semibold" margin="0 0 10 0">
        {currentStep?.name}
      </Text>
      <Text testID="stepDescription">{currentStep?.text}</Text>
      <Row
        align="center"
        crossAlign="center"
        margin="25 0 0 0"
        style={{justifyContent: 'space-between'}}>
        <Text>
          {currentStep?.order === 6 && isInitialDownloading
            ? '1 of 1'
            : currentStep?.order + ' of ' + totalStepsNumber}
        </Text>
        <Row>
          {isFirstStep ||
          (currentStep?.order === 6 && isInitialDownloading) ? null : (
            <Button
              title={labels?.previous}
              type="outline"
              styles={{width: 104, height: 40}}
              onPress={handlePrev}
            />
          )}
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
    </Column>
  );
};
