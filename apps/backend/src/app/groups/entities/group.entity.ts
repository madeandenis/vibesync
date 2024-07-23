import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('groups')
export class Group {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.groups, { nullable: false })
    @JoinColumn({ name: 'owner_id' })
    owner: User;

    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'jsonb' })
    songs: { id: string; title: string; image_url: string }[];

    @Column({ type: 'varchar', length: 15, nullable: true })
    ip_address: string;

    @Column('bytea', { nullable: true })
    cover_image: Buffer;

    @Column({ type: 'text', nullable: true })
    cover_image_name: string;

    @Column('bytea', { nullable: true })
    qr_code_image: Buffer;

    @Column({ type: 'boolean', default: false })
    is_active: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
