import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { Characteristics } from "../../characteristics/entities/Characteristics";
import { ActivateWhen } from "./ActivateWhen";
import { ActivateUntil } from "./ActivateUntil";
import { ObjectCharacteristicsAssociation } from "./ObjectCharacteristicsAssociation";

@Entity("calculators")
export class Calculators {
  @PrimaryGeneratedColumn({type: 'bigint'})
  ID: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  subtitle: string;

  @Column({ type: 'varchar' })
  data: string;

  @Column({ type: 'varchar' })
  equation: string;

  @ManyToMany(() => Characteristics, characteristics => characteristics.calculators)
  @JoinTable()
  characteristic_meaning_of_clicking: Characteristics[];

  @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.calculators)
  @JoinTable()
  activate_whens: ActivateWhen[];

  @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.calculators)
  @JoinTable()
  activate_untils: ActivateUntil[];

  @ManyToMany(() => ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.calculators)
  objectCharacteristicsAssociations: ObjectCharacteristicsAssociation[];
}