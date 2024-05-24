import {useCopilot} from 'react-native-copilot';
import {COPILOT_FINAL_STEP} from '../shared/constants';
import {useContext} from 'react';
import {GlobalContext} from '../shared/GlobalContext';
import {AuthEvents, selectIsInitialDownload} from '../machines/auth';
import {useSelector} from '@xstate/react';

export const UseCopilotTooltip = () => {
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

  const {appService} = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const ONBOARDING_DONE = () => authService?.send(AuthEvents.ONBOARDING_DONE());
  const INITIAL_DOWNLOAD_DONE = () =>
    authService?.send(AuthEvents.INITIAL_DOWNLOAD_DONE());
  const isInitialDownloading = useSelector(
    authService,
    selectIsInitialDownload,
  );

  const CURRENT_STEP = currentStep?.order;
  const currentStepTitle = currentStep?.name;
  const currentStepDescription = currentStep?.text;

  const stepCount =
    isLastStep && isInitialDownloading
      ? '1 of 1'
      : CURRENT_STEP + ' of ' + totalStepsNumber;

  const isFinalStep = CURRENT_STEP === COPILOT_FINAL_STEP;

  copilotEvents.on('stop', () => {
    if (CURRENT_STEP <= COPILOT_PRE_FINAL_STEP) {
      ONBOARDING_DONE;
    }
    if (CURRENT_STEP === COPILOT_FINAL_STEP) {
      INITIAL_DOWNLOAD_DONE;
    }
  });

  return {
    goToNext,
    goToPrev,
    stop,
    CURRENT_STEP,
    currentStepTitle,
    currentStepDescription,
    isFirstStep,
    isLastStep,
    isFinalStep,
    totalStepsNumber,
    copilotEvents,
    stepCount,
    isInitialDownloading,
    INITIAL_DOWNLOAD_DONE,
    ONBOARDING_DONE,
  };
};
