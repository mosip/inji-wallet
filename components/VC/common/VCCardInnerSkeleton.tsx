import {Theme} from '../../ui/styleUtils';
import {Column, Row} from '../../ui';
import {ImageBackground} from 'react-native';
import {VCItemField} from './VCItemField';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

export const VCCardInnerSkeleton = () => {
  return (
    <ImageBackground
      source={Theme.CloseCard}
      resizeMode="stretch"
      style={Theme.Styles.vertloadingContainer}>
      <Column>
        <Row margin={'0 20 10 10'}>
          <Column style={{marginTop: 10}}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              width={80}
              height={80}
              style={{borderRadius: 5}}
            />
          </Column>
          <Column margin={'0 0 0 20'}>
            {
              <>
                <VCItemField
                  key={'empty1'}
                  fieldName={'empty'}
                  fieldValue={'empty'}
                  verifiableCredential={null}
                  wellknown={null}
                />
                <VCItemField
                  key={'empty2'}
                  fieldName={'empty'}
                  fieldValue={'empty'}
                  verifiableCredential={null}
                  wellknown={null}
                />
              </>
            }
          </Column>
        </Row>
        <Column margin="0 8 5 8">
          <VCItemField
            key={'empty3'}
            fieldName={'empty'}
            fieldValue={'empty'}
            verifiableCredential={null}
            wellknown={null}
          />
        </Column>
        <Row align={'space-between'} margin="0 8 5 8">
          <VCItemField
            key={'empty4'}
            fieldName={'empty'}
            fieldValue={'empty'}
            verifiableCredential={null}
            wellknown={null}
          />
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            width={60}
            height={60}
            style={{borderRadius: 5}}
          />
        </Row>
      </Column>
    </ImageBackground>
  );
};
