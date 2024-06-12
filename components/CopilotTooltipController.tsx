import {useCopilot} from 'react-native-copilot';
import {COPILOT_FINAL_STEP} from '../shared/constants';
import {useContext} from 'react';
import {GlobalContext} from '../shared/GlobalContext';
import {
  AuthEvents,
  selectIsInitialDownload,
  selectIsOnboarding,
} from '../machines/auth';
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
  const SET_TOUR_GUIDE = set =>
    authService?.send(AuthEvents.SET_TOUR_GUIDE(set));
  const isOnboarding = useSelector(authService, selectIsOnboarding);
  const isInitialDownloading = useSelector(
    authService,
    selectIsInitialDownload,
  );

  const TestID = {
    '1': 'help',
    '2': 'download',
    '3': 'scan',
    '4': 'history',
    '5': 'settings',
    '6': 'cardView',
  };

  const CURRENT_STEP = currentStep?.order;
  const currentStepTitle = currentStep?.name;
  const currentStepDescription = currentStep?.text;
  const titleTestID = `${TestID[CURRENT_STEP?.toString()]}Title`;
  const descriptionTestID = `${TestID[CURRENT_STEP?.toString()]}Description`;

  const stepCount =
    CURRENT_STEP === COPILOT_FINAL_STEP && isInitialDownloading
      ? '1 of 1'
      : CURRENT_STEP + ' of ' + totalStepsNumber;

  const isFinalStep = CURRENT_STEP === COPILOT_FINAL_STEP;

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
    isOnboarding,
    isInitialDownloading,
    titleTestID,
    descriptionTestID,
    INITIAL_DOWNLOAD_DONE,
    ONBOARDING_DONE,
    SET_TOUR_GUIDE,
  };
};
