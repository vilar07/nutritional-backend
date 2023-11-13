import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { Characteristics } from "../../characteristics/entities/Characteristics";
import { ActivateWhen } from "./ActivateWhen";
import { ActivateUntil } from "./ActivateUntil";

@Entity("forms")
export class Forms {
  @PrimaryGeneratedColumn({type: 'bigint'})
  ID: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  subtitle: string;

  @ManyToMany(() => Characteristics, characteristics => characteristics.forms)
  @JoinTable()
  characteristic_meaning_of_clicking: Characteristics[];

  @ManyToMany(() => ActivateWhen, activateWhen => activateWhen.forms)
  @JoinTable()
  activate_whens: ActivateWhen[];

  @ManyToMany(() => ActivateUntil, activateUntil => activateUntil.forms)
  @JoinTable()
  activate_untils: ActivateUntil[];
}