import React, { useState } from 'react';
import { Button, Column, Row, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { RefreshControl, Image, View } from 'react-native';
import { useMyVcsTab } from './MyVcsTabController';
import { HomeScreenTabProps } from './HomeScreen';
import { AddVcModal } from './MyVcs/AddVcModal';
import { GetVcModal } from './MyVcs/GetVcModal';
import { DownloadingVcModal } from './MyVcs/DownloadingVcModal';
import { useTranslation } from 'react-i18next';
import { VcItem } from '../../components/VcItem';
import { GET_INDIVIDUAL_ID } from '../../shared/constants';
import { Icon } from 'react-native-elements';
import { OnboardingOverlay } from './OnboardingOverlay';

export const MyVcsTab: React.FC<HomeScreenTabProps> = (props) => {
  const { t } = useTranslation('MyVcsTab');
  const controller = useMyVcsTab(props);

  const getId = () => {
    controller.DISMISS();
    controller.GET_VC();
  };

  const [isLabelVisible, setIsLabelVisible] = useState(false);
  const toggleContent = () => setIsLabelVisible(!isLabelVisible);

  const DowmloadingLabel: React.FC = () => {
    return (
      <Column style={{ display: isLabelVisible ? 'flex' : 'none' }}>
        <Row align="space-between" style={Theme.Styles.downloadingIdTag}>
          <Text align="left" size="smaller" weight="semibold" color="white">
            {t('downloadingIdTag')}
          </Text>
          <Icon
            name="close"
            color={Theme.Colors.whiteText}
            size={18}
            onPress={toggleContent}
          />
        </Row>
      </Column>
    );
  };

  const clearIndividualId = () => {
    GET_INDIVIDUAL_ID('');
  };

  {
    controller.isRequestSuccessful
      ? setTimeout(() => {
          controller.DISMISS();
        }, 6000)
      : null;
  }

  const DownloadingIdPopUp: React.FC = () => {
    return (
      <View
        style={{ display: controller.isRequestSuccessful ? 'flex' : 'none' }}>
        <Row style={Theme.Styles.popUp}>
          <Text color={Theme.Colors.whiteText} weight="semibold" size="smaller">
            {t('downloadingYourId')}
          </Text>
          <Icon
            name="close"
            onPress={controller.DISMISS}
            color={Theme.Colors.whiteText}
            size={19}
          />
          {clearIndividualId()}
        </Row>
      </View>
    );
  };

  return (
    <React.Fragment>
      <Column fill style={{ display: props.isVisible ? 'flex' : 'none' }}>
        <DownloadingIdPopUp />
        <Column fill pY={10} pX={18}>
          {controller.vcKeys.length > 0 && (
            <React.Fragment>
              <Column
                scroll
                margin="0 0 20 0"
                backgroundColor={Theme.Colors.lightGreyBackgroundColor}
                refreshControl={
                  <RefreshControl
                    refreshing={controller.isRefreshingVcs}
                    onRefresh={controller.REFRESH}
                  />
                }>
                {controller.vcKeys.map((vcKey, index) => {
                  if (vcKey.split(':')[4] === 'true') {
                    return (
                      <VcItem
                        key={`${vcKey}-${index}`}
                        vcKey={vcKey}
                        margin="0 2 8 2"
                        onPress={controller.VIEW_VC}
                        iconName="pushpin"
                        iconType="antdesign"
                      />
                    );
                  }
                })}
                {controller.vcKeys.map((vcKey, index) => {
                  if (vcKey.split(':')[4] === 'false') {
                    return (
                      <VcItem
                        key={`${vcKey}-${index}`}
                        vcKey={vcKey}
                        margin="0 2 8 2"
                        onPress={controller.VIEW_VC}
                      />
                    );
                  }
                })}
              </Column>
              <Button
                type="gradient"
                isVcThere
                disabled={controller.isRefreshingVcs}
                title={t('downloadID')}
                onPress={controller.DOWNLOAD_ID}
              />
            </React.Fragment>
          )}
          {controller.vcKeys.length === 0 && (
            <React.Fragment>
              <Column fill style={Theme.Styles.homeScreenContainer}>
                <Image source={Theme.DigitalIdentityLogo} />
                <Text weight="bold" margin="33 0 6 0" lineHeight={1}>
                  {t('bringYourDigitalID', {
                    vcLabel: controller.vcLabel.plural,
                  })}
                </Text>
                <Text
                  style={Theme.TextStyles.bold}
                  color={Theme.Colors.textLabel}
                  align="center"
                  margin="0 12 30 12">
                  {t('generateVcDescription', {
                    vcLabel: controller.vcLabel.singular,
                  })}
                </Text>
                <Button
                  type="gradient"
                  disabled={controller.isRefreshingVcs}
                  title={t('downloadID')}
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

      {controller.isRequestSuccessful && (
        <DownloadingVcModal
          isVisible={controller.isRequestSuccessful}
          onDismiss={controller.DISMISS}
          onShow={clearIndividualId}
        />
      )}
    </React.Fragment>
  );
};
