import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_table' })
@ObjectType()
@Directive('@shareable')
@Directive('@key(fields: "user_id")')
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  user_id: number;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  displayName: string;

  // @Field(() => Cart)
  // cart?: Cart;

  @Column()
  @Field()
  passwordHash: string;
}

// model User {
//   id           Int     @id @default(autoincrement())
//   email        String  @unique
//   displayName  String? @map("display_name")
//   passwordHash String? @map("password_hash")
//   role         Role    @default(PARTICIPANT)

//   avatarGoogleCloud         String?      @map("avatar_google_cloud")
//   isEmailConfirmed          Boolean      @default(false) @map("is_email_confirmed")
//   meetup                    UserMeetup[] @relation("Participants")
//   organizedMeetings         Meetup[]     @relation("Organizer")
//   currentHashedRefreshToken String?      @map("current_hashed_refresh_token")
