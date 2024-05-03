import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { Characteristics } from "../../characteristics/entities/Characteristics";
import { ActivateWhen } from "./ActivateWhen";
import { ActivateUntil } from "./ActivateUntil";
import { ObjectCharacteristicsAssociation } from "./ObjectCharacteristicsAssociation";
import { ObjectRatings } from "./ObjectRatings";

@Entity("forms")
export class Forms {
  @PrimaryGeneratedColumn({type: 'bigint'})
  ID: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  subtitle: string;
  
  @Column({ type: 'int', default: 0 }) // Adicionando o campo de número de visualizações
  views: number;

  @Column({ type: 'varchar', nullable: true }) // Time of day relevance
  time_of_day_relevance: string;

  @Column({ type: 'varchar', nullable: true }) // Seasonal relevance
  season_relevance: string; // You can store seasons as strings, e.g., "spring", "summer", "fall", "winter"

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.forms)
  activate_whens: ActivateWhen[];

  @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.forms)
  activate_untils: ActivateUntil[];

  @ManyToMany(() => ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.forms)
  objectCharacteristicsAssociations: ObjectCharacteristicsAssociation[];

  @ManyToMany(() => ObjectRatings, objectRating => objectRating.forms)
  ratings: ObjectRatings[];
}