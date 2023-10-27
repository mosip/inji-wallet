import React, {useLayoutEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Image, View, TextInput} from 'react-native';
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
import {
  ErrorMessage,
  getDisplayObjectForCurrentLanguage,
  Protocols,
} from '../../shared/openId4VCI/Utils';
import {
  getInteractEventData,
  getStartEventData,
  sendInteractEvent,
  sendStartEvent,
} from '../../shared/telemetry/TelemetryUtils';

export const IssuersScreen: React.FC<
  HomeRouteProps | RootRouteProps
> = props => {
  const controller = useIssuerScreenController(props);
  const {t} = useTranslation('IssuersScreen');

  const issuers = controller.issuers;
  let [issuersData, setIssuersData] = useState(issuers);
  const [search, setSearch] = useState('');

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

  const onPressHandler = (id: string, protocol: string) => {
    sendStartEvent(getStartEventData('VC Download', {id: id}));
    sendInteractEvent(
      getInteractEventData('VC Download', 'CLICK', `IssuerType: ${id}`),
    );
    protocol === Protocols.OTP
      ? controller.DOWNLOAD_ID()
      : controller.SELECTED_ISSUER(id);
  };

  const isGenericError = () => {
    return controller.errorMessageType === ErrorMessage.GENERIC;
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

  const searchIssuer = text => {
    if (text === '') {
      setIssuersData(issuers);
      setSearch(text);
    } else {
      let filterdData = issuers.filter(item => {
        if (
          getDisplayObjectForCurrentLanguage(item.display)
            ?.name.toLowerCase()
            .includes(text.toLowerCase())
        ) {
          return getDisplayObjectForCurrentLanguage(item.display);
        }
      }, []);

      setIssuersData(filterdData);
      setSearch(text);
    }
  };

  return (
    <React.Fragment>
      {controller.issuers.length > 0 && (
        <Column style={Theme.IssuersScreenStyles.issuerListOuterContainer}>
          <TextInput
            testID="issuerSearchBar"
            style={Theme.IssuersScreenStyles.issuersSearchBar}
            placeholder={t('searchByIssuersName')}
            value={search}
            onChangeText={text => searchIssuer(text)}
          />
          <View style={Theme.IssuersScreenStyles.issuersContainer}>
            {controller.issuers.length > 0 && (
              <FlatList
                data={issuersData}
                renderItem={({item}) => (
                  <Issuer
                    testID={removeWhiteSpace(item.credential_issuer)}
                    key={item.credential_issuer}
                    id={item.credential_issuer}
                    displayName={
                      getDisplayObjectForCurrentLanguage(item.display)?.name
                    }
                    logoUrl={
                      getDisplayObjectForCurrentLanguage(item.display)?.logo
                        ?.url
                    }
                    onPress={() =>
                      onPressHandler(item.credential_issuer, item.protocol)
                    }
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
