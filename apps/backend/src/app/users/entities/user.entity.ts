import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../../roles/enitities/roles.entity';
import { CreateUserDto } from '../dto/create-user.dto';

export enum SongPlatforms {
  SPOTIFY = 'SPOTIFY',
  YOUTUBE_MUSIC = 'YOUTUBE_MUSIC',
  APPLE_PLAY = 'APPLE_PLAY',
}

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  third_party_user_id: number;

  @Column({
    type: 'enum',
    enum: SongPlatforms,
  })
  third_party_provider: SongPlatforms;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  refresh_token: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profile_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar_url: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  ip_address: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
