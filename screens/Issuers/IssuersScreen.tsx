import React, {useLayoutEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Image, Text, View} from 'react-native';
import {Issuer} from '../../components/openId4VCI/Issuer';
import {Error} from '../../components/ui/Error';
import {Header} from '../../components/ui/Header';
import {Column} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {RootRouteProps} from '../../routes';
import {HomeRouteProps} from '../../routes/main';
import {useIssuerScreenController} from './IssuerScreenController';
import {Loader} from '../../components/ui/Loader';
import testIDProps, {removeWhiteSpace} from '../../shared/commonUtil';

export const IssuersScreen: React.FC<
  HomeRouteProps | RootRouteProps
> = props => {
  const controller = useIssuerScreenController(props);
  const {t} = useTranslation('IssuersScreen');

  useLayoutEffect(() => {
    if (controller.loadingReason || controller.errorMessageType) {
      props.navigation.setOptions({
        headerShown: false,
      });
    } else {
      props.navigation.setOptions({
        headerShown: true,
        header: props => (
          <Header
            goBack={props.navigation.goBack}
            title={t('title')}
            testID="issuersScreenHeader"
          />
        ),
      });
    }

    if (controller.isStoring) {
      props.navigation.goBack();
    }
  }, [
    controller.loadingReason,
    controller.errorMessageType,
    controller.isStoring,
  ]);

  const onPressHandler = (id: string) => {
    if (id !== 'UIN, VID, AID') {
      controller.SELECTED_ISSUER(id);
    } else {
      controller.DOWNLOAD_ID();
    }
  };

  const isGenericError = () => {
    return controller.errorMessageType === 'generic';
  };

  const goBack = () => {
    if (
      controller.errorMessageType &&
      controller.loadingReason === 'displayIssuers'
    ) {
      props.navigation.goBack();
    } else {
      controller.RESET_ERROR();
    }
  };

  const getImage = () => {
    if (isGenericError()) {
      return (
        <Image
          source={Theme.SomethingWentWrong}
          style={{width: 370, height: 150}}
          {...testIDProps('somethingWentWrongImage')}
        />
      );
    }
    return (
      <Image
        {...testIDProps('noInternetConnectionImage')}
        source={Theme.NoInternetConnection}
      />
    );
  };

  if (controller.errorMessageType) {
    return (
      <Error
        testID={`${controller.errorMessageType}Error`}
        isVisible={controller.errorMessageType !== ''}
        title={t(`errors.${controller.errorMessageType}.title`)}
        message={t(`errors.${controller.errorMessageType}.message`)}
        goBack={goBack}
        tryAgain={controller.TRY_AGAIN}
        image={getImage()}
      />
    );
  }

  if (controller.loadingReason) {
    return (
      <Loader
        isVisible
        title={t('loaders.loading')}
        subTitle={t(`loaders.subTitle.${controller.loadingReason}`)}
        progress
      />
    );
  }

  return (
    <React.Fragment>
      {controller.issuers.length > 0 && (
        <Column style={Theme.issuersScreenStyles.issuerListOuterContainer}>
          <Text
            {...testIDProps('addCardDescription')}
            style={{
              ...Theme.TextStyles.regularGrey,
              marginVertical: 14,
              marginHorizontal: 9,
            }}>
            {t('header')}
          </Text>
          <View style={Theme.issuersScreenStyles.issuersContainer}>
            {controller.issuers.length > 0 && (
              <FlatList
                data={controller.issuers}
                scrollEnabled={false}
                renderItem={({item}) => (
                  <Issuer
                    testID={removeWhiteSpace(item.id)}
                    key={item.id}
                    id={item.id}
                    displayName={item.displayName}
                    logoUrl={item.logoUrl}
                    onPress={() => onPressHandler(item.id)}
                    {...props}
                  />
                )}
                numColumns={2}
                keyExtractor={item => item.id}
              />
            )}
          </View>
        </Column>
      )}
    </React.Fragment>
  );
};
