import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
class StripeEvent {
  @PrimaryColumn()
  public id: string;
}

export default StripeEvent;
