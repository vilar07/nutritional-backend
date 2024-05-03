import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { User } from "../../users/entities/User";
import { Articles } from "./Articles";
import { Calculators } from "./Calculators";
import { Carousels } from "./Carousels";
import { MealCards } from "./MealCards";
import { Forms } from "./Forms";


@Entity("ObjectRatings")
export class ObjectRatings {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  ID: number;

  @Column({ type: 'int' })
  rating: number; // Assuming ratings are integers, e.g., 1 to 5

  @ManyToMany(() => User, user => user.ratings)
  @JoinTable()
  users: User[];

  @ManyToMany(() => Articles, article => article.ratings, { nullable: true })
  @JoinTable()
  articles: Articles[];

  @ManyToMany(() => Calculators, calculator => calculator.ratings, { nullable: true })
  @JoinTable()
  calculators: Calculators[];

  @ManyToMany(() => Carousels, carousel => carousel.ratings, { nullable: true })
  @JoinTable()
  carousels: Carousels[];

  @ManyToMany(() => MealCards, mealCard => mealCard.ratings, { nullable: true })
  @JoinTable()
  mealCards: MealCards[];

  @ManyToMany(() => Forms, form => form.ratings, { nullable: true })
  @JoinTable()
  forms: Forms[];

}