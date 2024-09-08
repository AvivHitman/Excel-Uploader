import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FileEntity } from './file.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    u_id: number;

    @Column({ type: 'varchar', length: 255 })
    u_name: string;

    @OneToMany(() => FileEntity, (file) => file.user)
    files: FileEntity[];
}
