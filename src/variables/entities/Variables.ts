import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProfileVariables } from './ProfileVariables';
import { VariableType } from './VariableType';

@Entity('variables')
export class Variables {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  category: string | null;

  @ManyToOne(() => ProfileVariables, (profileVariables) => profileVariables.variables)
  profileVariables: ProfileVariables;

  @ManyToOne(() => VariableType, (variableType) => variableType.variablesType)
  variableType: VariableType;

  @Column()
  createdAt: Date;
}