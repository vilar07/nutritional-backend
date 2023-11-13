import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { CharacteristicsType } from './CharacteristicsType';
import { ProfileCharacteristicsType } from './ProfileCharacteristicsType';

@Entity("characteristicsPossibleOptions")
export class CharacteristicsPossibleOptions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  possibleOptions: string;

  @ManyToMany(() => ProfileCharacteristicsType, profileCharacteristicsType => profileCharacteristicsType.characteristicsPossibleOptions)
  @JoinTable()
  profileCharacteristicsType: ProfileCharacteristicsType[];

  @ManyToMany(() => CharacteristicsType, characteristicsType => characteristicsType.characteristicsPossibleOptions)
  @JoinTable()
  characteristicsType: CharacteristicsType[];
}