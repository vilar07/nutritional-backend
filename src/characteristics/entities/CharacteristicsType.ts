import { Entity, PrimaryGeneratedColumn, Column, ManyToMany} from 'typeorm';
import { CharacteristicsPossibleOptions } from './CharacteristicsPossibleOptions';

@Entity("characteristicsType")
export class CharacteristicsType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar'})
  variable_type: string;

  @Column({ type: 'date' })
  created_at: Date;

  @ManyToMany(() => CharacteristicsPossibleOptions, characteristicsPossibleOptions => characteristicsPossibleOptions.characteristicsType)
  characteristicsPossibleOptions: CharacteristicsPossibleOptions[];
}