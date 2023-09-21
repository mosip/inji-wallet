import React, {Fragment} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, SafeAreaView, View} from 'react-native';
import Spinner from 'react-native-spinkit';
import {Button, Centered, Column, Row, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import testIDProps from '../../shared/commonUtil';

export const Loader: React.FC<LoaderProps> = props => {
  const {t} = useTranslation('ScanScreen');

  return (
    <Fragment>
      <Row elevation={3}>
        <SafeAreaView style={Theme.ModalStyles.header}>
          <Row
            fill
            align={'flex-start'}
            style={Theme.LoaderStyles.titleContainer}>
            <View style={Theme.issuersScreenStyles.loaderHeadingText}>
              <Text style={Theme.TextStyles.header} testID="loaderTitle">
                {props.title}
              </Text>
              {props.subTitle && (
                <Text
                  style={Theme.TextStyles.subHeader}
                  color={Theme.Colors.profileValue}
                  testID="loaderSubTitle">
                  {props.subTitle}
                </Text>
              )}
            </View>
          </Row>
        </SafeAreaView>
      </Row>
      <Centered crossAlign="center" fill>
        <Column margin="24 0" align="space-around">
          <Image
            source={Theme.InjiProgressingLogo}
            height={2}
            width={2}
            style={{marginLeft: -6}}
            {...testIDProps('progressingLogo')}
          />
          <View {...testIDProps('threeDotsLoader')}>
            <Spinner
              type="ThreeBounce"
              color={Theme.Colors.Loading}
              style={{marginLeft: 6}}
            />
          </View>
        </Column>

        <Column style={{display: props.hint ? 'flex' : 'none'}}>
          <Column style={Theme.SelectVcOverlayStyles.timeoutHintContainer}>
            <Text
              align="center"
              color={Theme.Colors.TimoutText}
              style={Theme.TextStyles.bold}>
              {props.hint}
            </Text>
            {props.onCancel && (
              <Button
                type="clear"
                title={t('common:cancel')}
                onPress={props.onCancel}
              />
            )}
          </Column>
        </Column>
      </Centered>
    </Fragment>
  );
};

export interface LoaderProps {
  isVisible: boolean;
  title?: string;
  subTitle?: string;
  label?: string;
  hint?: string;
  onCancel?: () => void;
  requester?: boolean;
  progress?: boolean | number;
  onBackdropPress?: () => void;
}
