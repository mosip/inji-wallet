import asn1 from 'asn1.js';
import { Buffer } from 'buffer';

const convertDerToRsFormat = (derSignature) => {
  const ASN1Integer = asn1.define('ASN1Integer', function () {
    this.int();
  });

  const ASN1Sequence = asn1.define('ASN1Sequence', function () {
    this.seq().obj(
      this.key('r').int(),
      this.key('s').int()
    );
  });

  const derBuffer = Buffer.from(derSignature);
  const seq = ASN1Sequence.decode(derBuffer, 'der');
  const r = seq.r.toArrayLike(Buffer, 'be', 32);
  const s = seq.s.toArrayLike(Buffer, 'be', 32);

  const rsBuffer = Buffer.concat([r, s]);

  return rsBuffer.toString('base64');
};

export default convertDerToRsFormat;