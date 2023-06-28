import React from 'react';
import { Button, Column, Row, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { RefreshControl, Image, View } from 'react-native';
import { useMyVcsTab } from './MyVcsTabController';
import { HomeScreenTabProps } from './HomeScreen';
import { AddVcModal } from './MyVcs/AddVcModal';
import { GetVcModal } from './MyVcs/GetVcModal';
import { useTranslation } from 'react-i18next';
import { VcItem } from '../../components/VcItem';
import { GET_INDIVIDUAL_ID } from '../../shared/constants';
import { ErrorMessageOverlay } from '../../components/MessageOverlay';
import { Icon } from 'react-native-elements';

export const MyVcsTab: React.FC<HomeScreenTabProps> = (props) => {
  const { t } = useTranslation('MyVcsTab');
  const controller = useMyVcsTab(props);
  let storeErrorTranslationPath = 'errors.savingFailed';

  //ENOSPC - no space left on a device / drive
  const isDiskFullError =
    controller.storeError?.message?.match('ENOSPC') != null;

  if (isDiskFullError) {
    storeErrorTranslationPath = 'errors.diskFullError';
  }

  const getId = () => {
    controller.DISMISS();
    controller.GET_VC();
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
            onPress={() => {
              controller.DISMISS();
              clearIndividualId();
            }}
            color={Theme.Colors.whiteText}
            size={19}
          />
        </Row>
      </View>
    );
  };

  return (
    <React.Fragment>
      <Column fill style={{ display: props.isVisible ? 'flex' : 'none' }}>
        <DownloadingIdPopUp />
        <Column fill pY={18} pX={15}>
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
                title={t('generateVc')}
                onPress={controller.DOWNLOAD_ID}
              />
            </React.Fragment>
          )}
          {controller.vcKeys.length === 0 && (
            <React.Fragment>
              <Column fill style={Theme.Styles.homeScreenContainer}>
                <Image source={Theme.DigitalIdentityLogo} />
                <Text
                  align="center"
                  weight="bold"
                  margin="33 0 6 0"
                  lineHeight={1}>
                  {t('bringYourDigitalID')}
                </Text>
                <Text
                  style={Theme.TextStyles.bold}
                  color={Theme.Colors.textLabel}
                  align="center"
                  margin="0 12 30 12">
                  {t('generateVcDescription')}
                </Text>
                <Button
                  type="gradient"
                  disabled={controller.isRefreshingVcs}
                  title={t('generateVc')}
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
      <ErrorMessageOverlay
        translationPath={'MyVcsTab'}
        isVisible={controller.isSavingFailedInIdle}
        error={storeErrorTranslationPath}
        onDismiss={controller.DISMISS}
      />
    </React.Fragment>
  );
};
