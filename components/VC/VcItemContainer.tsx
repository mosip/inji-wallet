import {
  EsignetMosipVCItem,
  EsignetMosipVCItemProps,
} from './EsignetMosipVCItem/EsignetMosipVCItem';
import React from 'react';
import {
  ExistingMosipVCItem,
  ExistingMosipVCItemProps,
} from './ExistingMosipVCItem/ExistingMosipVCItem';

export const VcItemContainer: React.FC<
  ExistingMosipVCItemProps | EsignetMosipVCItemProps
> = (props) => {
  if (props.vcMetadata.isFromOpenId4VCI()) {
    return <EsignetMosipVCItem {...props} />;
  }
  return <ExistingMosipVCItem {...props} />;
};
