import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { CharacteristicsPossibleOptions } from './CharacteristicsPossibleOptions';

@Entity("profileCharacteristicsType")
export class ProfileCharacteristicsType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  profile_characteristic_type: string;

  @Column({ type: 'date' })
  created_at: Date;

  @ManyToMany(() => CharacteristicsPossibleOptions, characteristicsPossibleOptions => characteristicsPossibleOptions.profileCharacteristicsType)
  characteristicsPossibleOptions: CharacteristicsPossibleOptions[];

}
