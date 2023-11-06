import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { VariableType } from './VariableType';
import { VariableProfile } from './VariableProfile';

@Entity("variablePossibleOptions")
export class VariablePossibleOptions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  possibleOptions: string;

  @ManyToOne(() => VariableProfile, { nullable: true })
  @JoinColumn({ name: 'variable_profile_id' })
  variableProfile: VariableProfile;

  @ManyToOne(() => VariableType, { nullable: true })
  @JoinColumn({ name: 'variable_type_id' })
  variableType: VariableType;
}