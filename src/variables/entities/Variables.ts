import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { VariablePossibleOptions } from './VariablePossibleOptions';


@Entity('variables')
export class Variables {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  category: string | null;

  @ManyToOne(() => VariablePossibleOptions, { nullable: true })
  @JoinColumn({ name: 'variablePossibleOptions_id' })
  variablePossibleOptions: VariablePossibleOptions;

  @Column()
  createdAt: Date;
}