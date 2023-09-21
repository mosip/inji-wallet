import {
  EsignetMosipVCItem,
  EsignetMosipVCItemProps,
} from './EsignetMosipVCItem/EsignetMosipVCItem';
import React from 'react';
import {VcItem, VcItemProps} from '../VcItem';

export const VcItemContainer: React.FC<
  VcItemProps | EsignetMosipVCItemProps
> = props => {
  if (props.vcMetadata.isFromOpenId4VCI()) {
    return <EsignetMosipVCItem {...props} />;
  }
  console.log('vcitm');
  return <VcItem {...props} />;
};
