import React, {Fragment, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {BackHandler, SafeAreaView, View} from 'react-native';
import {Button, Centered, Column, Row, Text} from '../../components/ui';
import {Theme} from './styleUtils';
import {LoaderAnimation} from './LoaderAnimation';
import {Modal} from './Modal';
import {BannerNotification} from '../../components/BannerNotification';
import {BannerStatusType} from '../../components/BannerNotification';

export const Loader: React.FC<LoaderProps> = ({
                                                title,
                                                subTitle,
                                                isModal = false,
                                                hint,
                                                onStayInProgress,
                                                isHintVisible,
                                                onCancel,
                                                onRetry,
                                                showBanner,
                                                bannerMessage,
                                                onBannerClose,
                                                bannerType,
                                                bannerTestID,
                                              }) => {
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
        {(isHintVisible || onCancel) && (
          <Column style={Theme.SelectVcOverlayStyles.timeoutHintContainer}>
            {hint && (
              <Text
                align="center"
                margin="10"
                color={Theme.Colors.TimeoutHintText}
                size="small"
                style={Theme.TextStyles.bold}>
                {hint}
              </Text>
            )}
            {onStayInProgress && (
              <Button
                type="clear"
                title={t('status.stayOnTheScreen')}
                onPress={onStayInProgress}
              />
            )}
            {onRetry && (
              <Button
                type="clear"
                title={t('status.retry')}
                onPress={onRetry}
              />
            )}
            {onCancel && (
              <Button
                type="clear"
                title={t('common:cancel')}
                onPress={onCancel}
              />
            )}
          </Column>
        )}
      </Centered>
    );
  }

  return (
    <Fragment>
      {isModal ? (
        <Modal
          headerTitle={title}
          isVisible={isModal}
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
                    {title}
                  </Text>
                  {subTitle && (
                    <Text
                      style={Theme.TextStyles.subHeader}
                      color={Theme.Colors.textLabel}
                      testID="loaderSubTitle">
                      {subTitle}
                    </Text>
                  )}
                </View>
              </Row>
            </SafeAreaView>
          </Row>
          <View style={Theme.Styles.hrLineFill}></View>
          {showBanner && (
            <BannerNotification
              type={
                bannerType ? bannerType : BannerStatusType.SUCCESS
              }
              message={bannerMessage as string}
              onClosePress={onBannerClose as () => void}
              testId={bannerTestID as string}
            />
          )}

              {loaderContent()}
            </Fragment>
        )}
      </Fragment>
  );
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
  bannerType?: BannerStatusType;
  bannerTestID?: string;
}