import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { FileEntity } from './file.entity';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    c_id: number;

    @Column({ type: 'varchar', length: 255 })
    c_name: string;

    @Column({ type: 'varchar', length: 255 })
    c_email: string;

    @Column({ type: 'varchar', length: 255 })
    c_israeli_id: string;

    @Column({ type: 'varchar', length: 255 })
    c_phone: string;

    @ManyToOne(() => FileEntity, file => file.customers, {
        onDelete: 'CASCADE',
        nullable: true,
    })

    @JoinColumn({ name: 'f_id' })
    file: Relation<FileEntity>
}