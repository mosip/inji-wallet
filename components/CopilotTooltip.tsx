import React from 'react';
import {Text, Button, Row, Column} from './../components/ui';
import {useTranslation} from 'react-i18next';
import {UseCopilotTooltip} from './CopilotTooltipController';
import {Theme} from './ui/styleUtils';

export const CopilotTooltip = () => {
  const {t} = useTranslation('copilot');
  const controller = UseCopilotTooltip();

  return (
    <Column>
      <Text
        testID={controller.currentStepTitle}
        weight="bold"
        margin="0 0 10 0">
        {controller.currentStepTitle}
      </Text>
      <Text testID={`${controller.currentStepTitle}Description`}>
        {controller.currentStepDescription}
      </Text>
      <Row
        align="center"
        crossAlign="center"
        margin="25 0 0 0"
        style={{justifyContent: 'space-between'}}>
        <Text testID={`${controller.CURRENT_STEP}stepCount`} weight="bold">
          {controller.stepCount}
        </Text>
        <Row>
          {controller.isFirstStep ||
          (controller.isFinalStep && controller.isInitialDownloading) ? null : (
            <Button
              testID={`${controller.CURRENT_STEP}previous`}
              title={t('previous')}
              type="outline"
              styles={Theme.Styles.copilotButton}
              onPress={controller.goToPrev}
            />
          )}
          {controller.isLastStep ? (
            <Button
              testID={`${controller.CURRENT_STEP}done`}
              title={t('done')}
              type="solid"
              styles={Theme.Styles.copilotButton}
              onPress={controller.stop}
            />
          ) : (
            <Button
              testID={`${controller.CURRENT_STEP}next`}
              title={t('next')}
              type="solid"
              styles={Theme.Styles.copilotButton}
              onPress={controller.goToNext}
            />
          )}
        </Row>
      </Row>
    </Column>
  );
};
