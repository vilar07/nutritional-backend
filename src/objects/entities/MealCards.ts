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

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number; 

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'varchar' })
  link: string;

  @Column({ type: 'int', default: 0 })
  number_ingridients: number;

  @Column({ type: 'int', default: 0 }) 
  views: number;

  @Column({ type: 'varchar', nullable: true }) // Time of day relevance
  time_of_day_relevance: string;

  @Column({ type: 'varchar', nullable: true }) // Seasonal relevance
  season_relevance: string; // You can store seasons as strings, e.g., "spring", "summer", "fall", "winter"
   
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.mealCards)
  activate_whens: ActivateWhen[];

  @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.mealCards)
  activate_untils: ActivateUntil[];

  @ManyToMany(() => ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.mealCards)
  objectCharacteristicsAssociations: ObjectCharacteristicsAssociation[];
}