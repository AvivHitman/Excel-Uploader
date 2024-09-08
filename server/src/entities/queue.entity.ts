import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { FileEntity } from './file.entity';

@Entity('upload_queue')
export class Queue {
    @PrimaryGeneratedColumn()
    q_id: number;

    @Column({ type: 'enum', enum: ['pending', 'uploading'], default: 'pending' })
    q_status: 'pending' | 'uploading';

    @ManyToOne(() => FileEntity, { eager: true })
    @JoinColumn({ name: 'f_id' })
    file: Relation<FileEntity>;
}
