import React from 'react';
import {EsignetMosipVCItemDetails} from './EsignetMosipVCItem/EsignetMosipVCItemDetails';
import {ExistingMosipVCItemDetails} from './ExistingMosipVCItem/ExistingMosipVCItemDetails';
import {VCMetadata} from '../../shared/VCMetadata';
import {VcDetails} from '../VcDetails';

export const VcDetailsContainer: React.FC = props => {
  console.log('vc in VcDetailsContainer', props.vc);

  if (VCMetadata.fromVC(props.vc.vcMetadata).isFromOpenId4VCI()) {
    return (
      <EsignetMosipVCItemDetails
        vc={undefined}
        isBindingPending={false}
        {...props}
      />
    );
  }
  return <VcDetails isBindingPending={false} {...props} />;
};
