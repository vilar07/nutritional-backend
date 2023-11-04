import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Variables } from './Variables';

@Entity('variablesType')
export class VariableType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['continuous/interval', 'nominal', 'discrete', 'ordinal', 'dichotomous'],
  })
  variables_type: string;

  @OneToMany(() => Variables, (variable) => variable.variableType)
  variablesType: Variables[];

  @Column()
  createdAt: Date;
}