import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { VariablePossibleOptions } from './VariablePossibleOptions';

@Entity()
export class VariableType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  variable_type: string;

  @Column({ type: 'date' })
  created_at: Date;

  @OneToMany(() => VariablePossibleOptions, (options) => options.variableType)
  possibleOptions: VariablePossibleOptions[];
}