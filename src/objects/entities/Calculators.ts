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

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' }) 
  variable_to_calculate: string;

  @Column({ type: 'varchar' })
  equation: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'int', default: 0 }) // Adicionando o campo de número de visualizações
  views: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.calculators)
  activate_whens: ActivateWhen[];

  @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.calculators)
  activate_untils: ActivateUntil[];

  @ManyToMany(() => ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.calculators)
  objectCharacteristicsAssociations: ObjectCharacteristicsAssociation[];
}