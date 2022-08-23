import React from 'react';
import { Dimensions, RefreshControl, StyleSheet, View } from 'react-native';
import { Divider, Icon, ListItem, Overlay } from 'react-native-elements';
import { Button, Column, Centered, Row, Text,  } from '../../components/ui';
import { VidItem } from '../../components/VidItem';
import { Colors } from '../../components/ui/styleUtils';
import { OtpVerificationModal } from '../Home/MyVcs/OtpVerificationModal';
import { ToastItem } from '../../components/ui/ToastItem';

import { useTranslation } from 'react-i18next';
import { useRevoke } from './RevokeController';

export const Revoke: React.FC<RevokeScreenProps> = (props) => {
  const controller = useRevoke();
  const { t } = useTranslation('ProfileScreen');
  console.log('toastVisible', controller.toastVisible)
  const styles = StyleSheet.create({
    buttonContainer: {
      position: 'absolute',
      left: 0,
      right: 'auto',
    },
    view: {
      flex: 1,
      width: Dimensions.get('screen').width,
    },
    revokeView: { padding: 20 },
    flexRow: {flexDirection: 'row', margin: 0, padding: 0},
    rowStyle: { flexDirection: 'column', justifyContent: 'space-between'}
  });

  return (
    <ListItem bottomDivider onPress={() => controller.setIsViewing(true)}>
      <ListItem.Content>
        <ListItem.Title>
          <Text>{props.label}</Text>
        </ListItem.Title>
      </ListItem.Content>
      <Overlay
        overlayStyle={{ padding: 24 }}
        isVisible={controller.isViewing}
        onBackdropPress={() => controller.setIsViewing(false)}>
        <View style={styles.view}>
          <Row align="center" crossAlign="center" margin="0 0 10 0">
            <View style={styles.buttonContainer}>
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
          <Row style={styles.rowStyle} fill>
            {controller.toastVisible && <ToastItem message={controller.message} />}
            <View style={styles.revokeView}>
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
                      key={vcKey}
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
      </Overlay>
      <Overlay
        overlayStyle={{ padding: 24, elevation: 6 }}
        isVisible={controller.isRevoking}
        onBackdropPress={() => controller.setRevoking(false)}>
        <Column width={Dimensions.get('screen').width * 0.8}>
          <Text weight="semibold" margin="0 0 12 0">
            {t('revokeLabel')}
          </Text>
          <Text margin="0 0 12 0">
            {t('revokingVids', { count: controller.selectedVidKeys.length })}
          </Text>
          {controller.selectedVidKeys.map((vcKey, index) => (
            <View style={styles.flexRow} key={index}>
              <Text margin="0 8" weight="bold">{'\u2022'}</Text>
              <Text margin="0 0 0 0" weight="bold">{vcKey.split(":")[2]}</Text>
            </View>
          ))}
          <Text margin="12 0">
            {t('revokingVidsAfter')}
          </Text>
          <Row>
            <Button
              fill
              type="clear"
              title={t('cancel')}
              onPress={() =>controller.setRevoking(false)}
            />
            <Button fill title={t('revokeLabel')} onPress={controller.REVOKE_VC} />
          </Row>
        </Column>
      </Overlay>
      <OtpVerificationModal
        isVisible={controller.isAcceptingOtpInput}
        onDismiss={controller.DISMISS}
        onInputDone={controller.INPUT_OTP}
        error={controller.error}
      />
    </ListItem>
  );
};

interface RevokeScreenProps{
  label: string;
}
