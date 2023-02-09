import React from 'react';
import { Button, Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { RefreshControl, Image } from 'react-native';
import { useMyVcsTab } from './MyVcsTabController';
import { HomeScreenTabProps } from './HomeScreen';
import { AddVcModal } from './MyVcs/AddVcModal';
import { GetVcModal } from './MyVcs/GetVcModal';
import { DownloadingVcModal } from './MyVcs/DownloadingVcModal';
import { OnboardingOverlay } from './OnboardingOverlay';
import { useTranslation } from 'react-i18next';
import { VcItem } from '../../components/VcItem';
import { GET_INDIVIDUAL_ID } from '../../shared/constants';

export const MyVcsTab: React.FC<HomeScreenTabProps> = (props) => {
  const { t } = useTranslation('MyVcsTab');
  const controller = useMyVcsTab(props);

  const getId = () => {
    controller.DISMISS();
    controller.GET_VC();
  };

  const clearIndividualId = () => {
    GET_INDIVIDUAL_ID('');
  };

  return (
    <React.Fragment>
      <Column fill style={{ display: props.isVisible ? 'flex' : 'none' }}>
        <Column fill pY={14} pX={14}>
          {controller.vcKeys.length > 0 && (
            <React.Fragment>
              <Column
                scroll
                margin="0 0 20 0"
                refreshControl={
                  <RefreshControl
                    refreshing={controller.isRefreshingVcs}
                    onRefresh={controller.REFRESH}
                  />
                }>
                {controller.vcKeys.map((vcKey, index) => (
                  <VcItem
                    key={`${vcKey}-${index}`}
                    vcKey={vcKey}
                    margin="0 2 8 2"
                    onPress={controller.VIEW_VC}
                  />
                ))}
              </Column>
              <Button
                type="gradient"
                linearGradient
                isVcThere
                disabled={controller.isRefreshingVcs}
                title={t('downloadID', {
                  vcLabel: controller.vcLabel.singular,
                })}
                onPress={controller.DOWNLOAD_ID}
              />
            </React.Fragment>
          )}
          {controller.vcKeys.length === 0 && (
            <React.Fragment>
              <Column fill style={Theme.Styles.homeScreenContainer}>
                <Image source={Theme.DigitalIdentityLogo} />
                <Text weight="bold" margin="33 0 6 0">
                  {t('bringYourDigitalID', {
                    vcLabel: controller.vcLabel.plural,
                  })}
                </Text>
                <Text
                  weight="semibold"
                  style={Theme.TextStyles.small}
                  color={Theme.Colors.textLabel}
                  align="center"
                  margin="0 12 33 12">
                  {t('generateVcDescription', {
                    vcLabel: controller.vcLabel.singular,
                  })}
                </Text>
                <Button
                  type="gradientButton"
                  linearGradient
                  disabled={controller.isRefreshingVcs}
                  title={t('downloadID', {
                    vcLabel: controller.vcLabel.singular,
                  })}
                  onPress={controller.DOWNLOAD_ID}
                />
              </Column>
            </React.Fragment>
          )}
        </Column>
      </Column>

      {controller.AddVcModalService && (
        <AddVcModal service={controller.AddVcModalService} onPress={getId} />
      )}

      {controller.GetVcModalService && (
        <GetVcModal service={controller.GetVcModalService} />
      )}

      {controller.isRequestSuccessful && (
        <DownloadingVcModal
          isVisible={controller.isRequestSuccessful}
          onDismiss={controller.DISMISS}
          onShow={clearIndividualId}
        />
      )}

      <OnboardingOverlay
        isVisible={controller.isOnboarding}
        onDone={controller.ONBOARDING_DONE}
        onAddVc={controller.DOWNLOAD_ID}
      />
    </React.Fragment>
  );
};
