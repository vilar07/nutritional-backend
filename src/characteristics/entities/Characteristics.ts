import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany} from 'typeorm';
import { CharacteristicsPossibleOptions } from './CharacteristicsPossibleOptions';
import { ActivateWhen } from '../../objects/entities/ActivateWhen';
import { ActivateUntil } from '../../objects/entities/ActivateUntil';
import { ObjectCharacteristicsAssociation } from '../../objects/entities/ObjectCharacteristicsAssociation';
import { UserCharacteristicAssociation } from 'src/users/entities/UserCharacteristicAssociation';


@Entity('characteristics')
export class Characteristics {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ nullable: true })
  category: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  
  @ManyToOne(() => CharacteristicsPossibleOptions, { nullable: true })
  @JoinColumn({ name: 'characteristicPossibleOptions_id' })
  characteristicsPossibleOptions: CharacteristicsPossibleOptions;

  @ManyToMany(() => ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.characteristics)
  objectCharacteristicsAssociations: ObjectCharacteristicsAssociation[];
  
  @ManyToMany(() => UserCharacteristicAssociation, userCharacteristicAssociation => userCharacteristicAssociation.characteristics)
  userCharacteristicAssociation: UserCharacteristicAssociation[];

  @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.characteristics)
  activate_whens: ActivateWhen[];

  @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.characteristics)
  activate_untils: ActivateUntil[];
}