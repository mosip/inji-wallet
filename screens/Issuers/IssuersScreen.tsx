import React, {useLayoutEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Pressable, View} from 'react-native';
import {Issuer} from '../../components/openId4VCI/Issuer';
import {Error} from '../../components/ui/Error';
import {Header} from '../../components/ui/Header';
import {Button, Column, Row, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {RootRouteProps} from '../../routes';
import {HomeRouteProps} from '../../routes/routeTypes';
import {useIssuerScreenController} from './IssuerScreenController';
import {Loader} from '../../components/ui/Loader';
import {removeWhiteSpace} from '../../shared/commonUtil';
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
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';
import {MessageOverlay} from '../../components/MessageOverlay';
import {SearchBar} from '../../components/ui/SearchBar';
import {SvgImage} from '../../components/ui/svg';
import {Icon} from 'react-native-elements';
import {BannerNotificationContainer} from '../../components/BannerNotificationContainer';
import {CredentialTypeSelectionScreen} from './CredentialTypeSelectionScreen';

export const IssuersScreen: React.FC<
  HomeRouteProps | RootRouteProps
> = props => {
  const controller = useIssuerScreenController(props);
  const {t} = useTranslation('IssuersScreen');

  const issuers = controller.issuers;
  let [filteredSearchData, setFilteredSearchData] = useState(issuers);
  const [search, setSearch] = useState('');
  const [tapToSearch, setTapToSearch] = useState(false);
  const [clearSearchIcon, setClearSearchIcon] = useState(false);

  const isVerificationFailed = controller.verificationErrorMessage !== '';

  const verificationErrorMessage = t(
    `MyVcsTab:errors.verificationFailed.${controller.verificationErrorMessage}`,
  );

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
    sendStartEvent(
      getStartEventData(TelemetryConstants.FlowType.vcDownload, {id: id}),
    );
    sendInteractEvent(
      getInteractEventData(
        TelemetryConstants.FlowType.vcDownload,
        TelemetryConstants.InteractEventSubtype.click,
        `IssuerType: ${id}`,
      ),
    );
    protocol === Protocols.OTP
      ? controller.DOWNLOAD_ID()
      : controller.SELECTED_ISSUER(id);
  };

  const isGenericError = () => {
    return controller.errorMessageType === ErrorMessage.GENERIC;
  };

  const onFocusSearch = () => {
    setTapToSearch(true);
  };

  const clearSearchText = () => {
    filterIssuers('');
    setClearSearchIcon(false);
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
      return SvgImage.SomethingWentWrong();
    }
    return SvgImage.NoInternetConnection();
  };

  const filterIssuers = (searchText: string) => {
    const filteredData = issuers.filter(item => {
      if (
        getDisplayObjectForCurrentLanguage(item.display)
          ?.title.toLowerCase()
          .includes(searchText.toLowerCase())
      ) {
        return getDisplayObjectForCurrentLanguage(item.display);
      }
    });
    setFilteredSearchData(filteredData);
    setSearch(searchText);
    if (searchText !== '') {
      setClearSearchIcon(true);
    } else {
      setClearSearchIcon(false);
    }
  };
  if (controller.isSelectingCredentialType) {
    return <CredentialTypeSelectionScreen {...props} />;
  }

  if (isVerificationFailed) {
    return (
      <Error
        testID="verificationError"
        isVisible={isVerificationFailed}
        isModal={true}
        alignActionsOnEnd
        title={t('MyVcsTab:errors.verificationFailed.title')}
        message={verificationErrorMessage}
        image={SvgImage.PermissionDenied()}
        showClose={false}
        primaryButtonText="goBack"
        primaryButtonEvent={controller.RESET_VERIFY_ERROR}
        primaryButtonTestID="goBack"
        customStyles={{marginTop: '30%'}}
      />
    );
  }

  if (isVerificationFailed) {
    return (
      <Error
        testID="verificationError"
        isVisible={isVerificationFailed}
        isModal={true}
        alignActionsOnEnd
        title={t('MyVcsTab:errors.verificationFailed.title')}
        message={verificationErrorMessage}
        image={SvgImage.PermissionDenied()}
        showClose={false}
        primaryButtonText="goBack"
        primaryButtonEvent={controller.RESET_VERIFY_ERROR}
        primaryButtonTestID="goBack"
        customStyles={{marginTop: '30%'}}
      />
    );
  }

  if (controller.isBiometricsCancelled) {
    return (
      <MessageOverlay
        isVisible={controller.isBiometricsCancelled}
        minHeight={'auto'}
        title={t('errors.biometricsCancelled.title')}
        message={t('errors.biometricsCancelled.message')}
        onBackdropPress={controller.RESET_ERROR}>
        <Row>
          <Button
            fill
            type="clear"
            title={t('common:cancel')}
            onPress={controller.RESET_ERROR}
            margin={[0, 8, 0, 0]}
          />
          <Button
            testID="tryAgain"
            fill
            title={t('common:tryAgain')}
            onPress={controller.TRY_AGAIN}
          />
        </Row>
      </MessageOverlay>
    );
  }

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
        showClose
        primaryButtonTestID="tryAgain"
        primaryButtonText="tryAgain"
        primaryButtonEvent={controller.TRY_AGAIN}
        onDismiss={goBack}
      />
    );
  }

  if (controller.loadingReason) {
    return (
      <Loader
        title={t('loaders.loading')}
        subTitle={t(`loaders.subTitle.${controller.loadingReason}`)}
      />
    );
  }

  return (
    <React.Fragment>
      <BannerNotificationContainer />
      {controller.issuers.length > 0 && (
        <Column style={Theme.IssuersScreenStyles.issuerListOuterContainer}>
          <Row
            style={
              tapToSearch
                ? Theme.SearchBarStyles.searchBarContainer
                : Theme.SearchBarStyles.idleSearchBarBottomLine
            }>
            <SearchBar
              searchIconTestID="searchIssuerIcon"
              searchBarTestID="issuerSearchBar"
              search={search}
              placeholder={t('searchByIssuersName')}
              onFocus={onFocusSearch}
              onChangeText={filterIssuers}
              onLayout={() => filterIssuers('')}
            />
            {clearSearchIcon && (
              <Pressable onPress={clearSearchText}>
                <Icon
                  testID="clearingIssuerSearchIcon"
                  name="circle-with-cross"
                  type="entypo"
                  size={15}
                  color={Theme.Colors.DetailsLabel}
                />
              </Pressable>
            )}
          </Row>
          <Text
            testID="issuersScreenDescription"
            style={{
              ...Theme.TextStyles.regularGrey,
              ...Theme.IssuersScreenStyles.issuersSearchSubText,
            }}>
            {t('description')}
          </Text>
          <View style={Theme.IssuersScreenStyles.issuersContainer}>
            {controller.issuers.length > 0 && (
              <FlatList
                data={filteredSearchData}
                renderItem={({item}) => (
                  <Issuer
                    testID={removeWhiteSpace(item.credential_issuer)}
                    key={item.credential_issuer}
                    displayDetails={getDisplayObjectForCurrentLanguage(
                      item.display,
                    )}
                    onPress={() =>
                      onPressHandler(item.credential_issuer, item.protocol)
                    }
                    {...props}
                  />
                )}
                numColumns={1}
                keyExtractor={item => item.credential_issuer}
              />
            )}
          </View>
        </Column>
      )}
    </React.Fragment>
  );
};
