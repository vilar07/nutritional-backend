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

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.articles)
  activate_whens: ActivateWhen[];

  @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.articles)
  activate_untils: ActivateUntil[];

  @ManyToMany(() => ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.articles)
  objectCharacteristicsAssociations: ObjectCharacteristicsAssociation[];
}