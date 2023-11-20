import { Entity, PrimaryGeneratedColumn, Column, ManyToMany} from 'typeorm';
import { CharacteristicsPossibleOptions } from './CharacteristicsPossibleOptions';

@Entity("characteristicsType")
export class CharacteristicsType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar'})
  variable_type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToMany(() => CharacteristicsPossibleOptions, characteristicsPossibleOptions => characteristicsPossibleOptions.characteristicsType)
  characteristicsPossibleOptions: CharacteristicsPossibleOptions[];
}