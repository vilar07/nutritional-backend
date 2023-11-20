import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { CharacteristicsPossibleOptions } from './CharacteristicsPossibleOptions';

@Entity("profileCharacteristicsType")
export class ProfileCharacteristicsType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  profile_characteristic_type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToMany(() => CharacteristicsPossibleOptions, characteristicsPossibleOptions => characteristicsPossibleOptions.profileCharacteristicsType)
  characteristicsPossibleOptions: CharacteristicsPossibleOptions[];

}
