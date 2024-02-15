import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { Characteristics } from "../../characteristics/entities/Characteristics";
import { ActivateWhen } from "./ActivateWhen";
import { ActivateUntil } from "./ActivateUntil";
import { ObjectCharacteristicsAssociation } from "./ObjectCharacteristicsAssociation";

@Entity("mealCards")
export class MealCards {
  @PrimaryGeneratedColumn({type: 'bigint'})
  ID: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  subtitle: string;

  @Column({ type: 'varchar' })
  link: string;

  @Column({ type: 'int' })
  number_of_meals: number;

  @Column({ type: 'varchar' })
  type_of_recipe: string;

  @ManyToMany(() => Characteristics, characteristics => characteristics.mealCards)
  @JoinTable()
  characteristic_meaning_of_clicking: Characteristics[];

  @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.mealCards)
  @JoinTable()
  activate_whens: ActivateWhen[];

  @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.mealCards)
  @JoinTable()
  activate_untils: ActivateUntil[];

  @ManyToMany(() => ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.mealCards)
  objectCharacteristicsAssociations: ObjectCharacteristicsAssociation[];
}