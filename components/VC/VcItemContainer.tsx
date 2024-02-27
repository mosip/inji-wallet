import React from 'react';
import {
  VCCardView,
  EsignetVCItemProps,
  ExistingVCItemProps,
} from './Views/VCCardView';

export const VcItemContainer: React.FC<
  ExistingVCItemProps | EsignetVCItemProps
> = props => {
  return <VCCardView {...props} />;
};
