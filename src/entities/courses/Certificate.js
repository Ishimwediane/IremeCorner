import { EntitySchema } from 'typeorm';

export const CertificateStatus = {
  ISSUED: 'issued',
  REVOKED: 'revoked',
  EXPIRED: 'expired',
};

export const CertificateSchema = new EntitySchema({
  name: 'Certificate',
  tableName: 'certificates',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    }
    // TODO: Add other column definitions
  },
  relations: {
    // TODO: Add relation definitions
  }
});

export class Certificate {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}
