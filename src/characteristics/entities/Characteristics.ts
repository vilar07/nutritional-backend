import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { CharacteristicsPossibleOptions } from './CharacteristicsPossibleOptions';
import { ActivateWhen } from '../../objects/entities/ActivateWhen';
import { ActivateUntil } from '../../objects/entities/ActivateUntil';
import { Carousels } from '../../objects/entities/Carousels';
import { MealCards } from '../../objects/entities/MealCards';
import { Calculators } from '../../objects/entities/Calculators';
import { Articles } from '../../objects/entities/Articles';
import { Forms } from '../../objects/entities/Forms';


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

  @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.characteristics)
  activateWhens: ActivateWhen[];

  @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.characteristics)
  activateUntils: ActivateUntil[];

  @ManyToMany(() => Carousels, carousels => carousels.characteristic_meaning_of_clicking)
  carousels: Carousels[];

  @ManyToMany(() => MealCards, mealCards => mealCards.characteristic_meaning_of_clicking)
  mealCards: MealCards[];

  @ManyToMany(() => Calculators, calculators => calculators.characteristic_meaning_of_clicking)
  calculators: Calculators[];

  @ManyToMany(() => Articles, articles => articles.characteristic_meaning_of_clicking)
  articles: Articles[];

  @ManyToMany(() => Forms, forms => forms.characteristic_meaning_of_clicking)
  forms: Forms[];
}