/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */

import { ControllerProofPurpose } from './ControllerProofPurpose';

export class AssertionProofPurpose extends ControllerProofPurpose {
  constructor({
    term = 'assertionMethod', controller,
    date, maxTimestampDelta = Infinity}: any = {}) {
    super({term, controller, date, maxTimestampDelta});
  }
}
