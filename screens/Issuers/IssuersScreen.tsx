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
    if (controller.loadingReason || controller.errorMessage) {
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
  }, [controller.loadingReason, controller.errorMessage, controller.isStoring]);

  const onPressHandler = (id: string) => {
    if (id !== 'UIN, VID, AID') {
      controller.SELECTED_ISSUER(id);
    } else {
      controller.DOWNLOAD_ID();
    }
  };

  const isGenericError = () => {
    return controller.errorMessage === 'generic';
  };

  const goBack = () => {
    controller.RESET_ERROR();
    setTimeout(() => {
      props.navigation.goBack();
    }, 0);
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
      {controller.errorMessage && (
        <Error
          testID={`${controller.errorMessage}Error`}
          isVisible={controller.errorMessage !== ''}
          title={t(`errors.${controller.errorMessage}.title`)}
          message={t(`errors.${controller.errorMessage}.message`)}
          goBack={goBack}
          tryAgain={controller.TRY_AGAIN}
          image={getImage()}
        />
      )}
    </React.Fragment>
  );
};
