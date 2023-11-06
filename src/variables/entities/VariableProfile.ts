import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { VariablePossibleOptions } from './VariablePossibleOptions';


@Entity()
export class VariableProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  variable_profile: string;

  @Column({ type: 'date' })
  created_at: Date;

  @OneToMany(() => VariablePossibleOptions, (options) => options.variableProfile)
  possibleOptions: VariablePossibleOptions[];
}
