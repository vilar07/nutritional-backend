import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Variables } from './Variables';

@Entity('profileVariables')
export class ProfileVariables {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['demográfica', 'socioeconómica', 'variável_de_saude'],
  })
  type_profile_variables: string;

  
  @OneToMany(() => Variables, (variables) => variables.profileVariables)
  variables: Variables[];

}
