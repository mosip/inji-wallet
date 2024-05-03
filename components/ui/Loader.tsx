import React, {Fragment, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {BackHandler, SafeAreaView, View} from 'react-native';
import {Button, Centered, Column, Row, Text} from '../../components/ui';
import {Theme} from './styleUtils';
import {LoaderAnimation} from './LoaderAnimation';
import {Modal} from './Modal';
import {BannerNotification} from '../../components/BannerNotification';
import {BANNER_TYPE_SUCCESS, BANNER_TYPE_ERROR} from '../../shared/constants';

export const Loader: React.FC<LoaderProps> = props => {
  const {t} = useTranslation('ScanScreen');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  function loaderContent() {
    return (
      <Centered
        style={{backgroundColor: Theme.Colors.whiteBackgroundColor}}
        crossAlign="center"
        fill>
        <Column margin="24 0" align="space-around">
          <LoaderAnimation testID={'loader'} />
        </Column>
        {(props.isHintVisible || props.onCancel) && (
          <Column style={Theme.SelectVcOverlayStyles.timeoutHintContainer}>
            {props.hint && (
              <Text
                align="center"
                margin="10"
                color={Theme.Colors.TimeoutHintText}
                size="small"
                style={Theme.TextStyles.bold}>
                {props.hint}
              </Text>
            )}
            {props.onStayInProgress && (
              <Button
                type="clear"
                title={t('status.stayOnTheScreen')}
                onPress={props.onStayInProgress}
              />
            )}
            {props.onRetry && (
              <Button
                type="clear"
                title={t('status.retry')}
                onPress={props.onRetry}
              />
            )}
            {props.onCancel && (
              <Button
                type="clear"
                title={t('common:cancel')}
                onPress={props.onCancel}
              />
            )}
          </Column>
        )}
      </Centered>
    );
  }

  return (
    <Fragment>
      {props.isModal ? (
        <Modal
          headerTitle={props.title}
          isVisible={props.isModal}
          headerElevation={3}
          headerLeft={<Fragment></Fragment>}
          showClose={false}>
          <Centered
            style={{backgroundColor: Theme.Colors.whiteBackgroundColor}}
            crossAlign="center"
            fill>
            {loaderContent()}
          </Centered>
        </Modal>
      ) : (
        <Fragment>
          <Row>
            <SafeAreaView style={Theme.ModalStyles.header}>
              <Row
                fill
                align={'flex-start'}
                style={Theme.LoaderStyles.titleContainer}>
                <View style={Theme.LoaderStyles.heading}>
                  <Text
                    style={Theme.TextStyles.semiBoldHeader}
                    testID="loaderTitle">
                    {props.title}
                  </Text>
                  {props.subTitle && (
                    <Text
                      style={Theme.TextStyles.subHeader}
                      color={Theme.Colors.textLabel}
                      testID="loaderSubTitle">
                      {props.subTitle}
                    </Text>
                  )}
                </View>
              </Row>
            </SafeAreaView>
          </Row>
          <View style={Theme.Styles.hrLineFill}></View>
          {props.showBanner && (
            <BannerNotification
              type={props.bannerType ? props.bannerType : BANNER_TYPE_SUCCESS}
              message={props.bannerMessage as string}
              onClosePress={props.onBannerClose as () => void}
              testId={props.bannerTestID as string}
            />
          )}

          {loaderContent()}
        </Fragment>
      )}
    </Fragment>
  );
};

Loader.defaultProps = {
  isModal: false,
};

export interface LoaderProps {
  title: string;
  subTitle?: string;
  isModal?: boolean;
  hint?: string;
  onStayInProgress?: () => void;
  isHintVisible?: boolean;
  onCancel?: () => void;
  onRetry?: () => void;
  showBanner?: boolean;
  bannerMessage?: string;
  onBannerClose?: () => void;
  bannerType?: typeof BANNER_TYPE_SUCCESS | typeof BANNER_TYPE_ERROR;
  bannerTestID?: string;
}
