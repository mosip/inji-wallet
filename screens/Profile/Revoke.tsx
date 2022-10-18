import React from 'react';
import { Dimensions, RefreshControl, SafeAreaView, View } from 'react-native';
import { Divider, Icon, ListItem, Overlay } from 'react-native-elements';
import { Button, Column, Centered, Row, Text } from '../../components/ui';
import { VidItem } from '../../components/VidItem';
import { Theme } from '../../components/ui/styleUtils';
import { ToastItem } from '../../components/ui/ToastItem';
import { OIDcAuthenticationOverlay } from '../../components/OIDcAuthModal';
import { useTranslation } from 'react-i18next';
import { useRevoke } from './RevokeController';

export const Revoke: React.FC<RevokeScreenProps> = (props) => {
  const controller = useRevoke();
  const { t } = useTranslation('ProfileScreen');

  return (
    <ListItem bottomDivider onPress={() => controller.setAuthenticating(true)}>
      <ListItem.Content>
        <ListItem.Title>
          <Text>{props.label}</Text>
        </ListItem.Title>
      </ListItem.Content>
      <Overlay
        overlayStyle={{ padding: 0 }}
        isVisible={controller.isViewing}
        onBackdropPress={() => controller.setIsViewing(false)}>
        <SafeAreaView>
          {controller.toastVisible && (
            <ToastItem message={controller.message} />
          )}
          <View style={Theme.RevokeStyles.view}>
            <Row align="center" crossAlign="center" margin="0 0 10 0">
              <View style={Theme.RevokeStyles.buttonContainer}>
                <Button
                  type="clear"
                  icon={<Icon name="chevron-left" color={Colors.Orange} />}
                  title=""
                  onPress={() => controller.setIsViewing(false)}
                />
              </View>
              <Text size="small">{t('revokeHeader')}</Text>
            </Row>
            <Divider />
            <Row style={Theme.RevokeStyles.rowStyle} fill>
              <View style={Theme.RevokeStyles.revokeView}>
                {controller.vidKeys.length > 0 && (
                  <Column
                    scroll
                    refreshControl={
                      <RefreshControl
                        refreshing={controller.isRefreshingVcs}
                        onRefresh={controller.REFRESH}
                      />
                    }>
                    {controller.vidKeys.map((vcKey, index) => (
                      <VidItem
                        key={`${vcKey}-${index}`}
                        vcKey={vcKey}
                        margin="0 2 8 2"
                        onPress={controller.selectVcItem(index, vcKey)}
                        selectable
                        selected={controller.selectedVidKeys.includes(vcKey)}
                      />
                    ))}
                  </Column>
                )}
                {controller.vidKeys.length === 0 && (
                  <React.Fragment>
                    <Centered fill>
                      <Text weight="semibold" margin="0 0 8 0">
                        {t('empty')}
                      </Text>
                    </Centered>
                  </React.Fragment>
                )}
              </View>
              <Column margin="0 20">
                <Button
                  disabled={controller.selectedVidKeys.length === 0}
                  title={t('revokeHeader')}
                  onPress={controller.CONFIRM_REVOKE_VC}
                />
              </Column>
            </Row>
          </View>
        </SafeAreaView>
        {controller.isRevoking && (
          <View style={Theme.RevokeStyles.viewContainer}>
            <Centered fill>
              <Column
                width={Dimensions.get('screen').width * 0.8}
                style={Theme.RevokeStyles.boxContainer}>
                <Text weight="semibold" margin="0 0 12 0">
                  {t('revokeLabel')}
                </Text>
                <Text margin="0 0 12 0">
                  {t('revokingVids', {
                    count: controller.selectedVidKeys.length,
                  })}
                </Text>
                {controller.selectedVidKeys.map((vcKey, index) => (
                  <View style={Theme.RevokeStyles.flexRow} key={index}>
                    <Text margin="0 8" weight="bold">
                      {'\u2022'}
                    </Text>
                    <Text margin="0 0 0 0" weight="bold">
                      {vcKey.split(':')[2]}
                    </Text>
                  </View>
                ))}
                <Text margin="12 0">{t('revokingVidsAfter')}</Text>
                <Row>
                  <Button
                    fill
                    type="clear"
                    title={t('cancel')}
                    onPress={() => controller.setRevoking(false)}
                  />
                  <Button
                    fill
                    title={t('revokeLabel')}
                    onPress={controller.REVOKE_VC}
                  />
                </Row>
              </Column>
            </Centered>
          </View>
        )}
      </Overlay>

      <OIDcAuthenticationOverlay
        isVisible={controller.isAuthenticating}
        onDismiss={() => controller.setAuthenticating(false)}
        onVerify={() => {
          controller.setAuthenticating(false);
          controller.setIsViewing(true);
        }}
      />

      <OIDcAuthenticationOverlay
        isVisible={controller.isAcceptingOtpInput}
        onDismiss={controller.DISMISS}
        onVerify={() => {
          controller.setIsViewing(true);
          controller.revokeVc('111111');
        }}
      />
    </ListItem>
  );
};

interface RevokeScreenProps {
  label: string;
}
