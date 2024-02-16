import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany} from 'typeorm';
import { CharacteristicsPossibleOptions } from './CharacteristicsPossibleOptions';
import { ActivateWhen } from '../../objects/entities/ActivateWhen';
import { ActivateUntil } from '../../objects/entities/ActivateUntil';
import { Carousels } from '../../objects/entities/Carousels';
import { MealCards } from '../../objects/entities/MealCards';
import { Calculators } from '../../objects/entities/Calculators';
import { Articles } from '../../objects/entities/Articles';
import { Forms } from '../../objects/entities/Forms';
import { ObjectCharacteristicsAssociation } from '../../objects/entities/ObjectCharacteristicsAssociation';


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

  @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.characteristics)
  activate_whens: ActivateWhen[];

  @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.characteristics)
  activate_untils: ActivateUntil[];
}