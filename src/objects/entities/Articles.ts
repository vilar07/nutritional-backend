import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { Characteristics } from "../../characteristics/entities/Characteristics";
import { ActivateWhen } from "./ActivateWhen";
import { ActivateUntil } from "./ActivateUntil";
import { ObjectCharacteristicsAssociation } from "./ObjectCharacteristicsAssociation";

@Entity("articles")
export class Articles {
  @PrimaryGeneratedColumn({type: 'bigint'})
  ID: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  subtitle: string;

  @ManyToMany(() => Characteristics, characteristics => characteristics.articles)
  @JoinTable()
  characteristic_meaning_of_clicking: Characteristics[];

  @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.articles)
  @JoinTable()
  activate_whens: ActivateWhen[];

  @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.articles)
  @JoinTable()
  activate_untils: ActivateUntil[];

  @ManyToMany(() => ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.articles)
  objectCharacteristicsAssociations: ObjectCharacteristicsAssociation[];
}