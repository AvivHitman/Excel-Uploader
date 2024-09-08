import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, JoinColumn, Relation, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Customer } from './customers.entity';
import { Queue } from './queue.entity';


@Entity('files')
export class FileEntity {
    @PrimaryGeneratedColumn()
    f_id: number;

    @Column()
    f_path: string;

    @Column()
    f_name: string;

    @Column({ type: 'enum', enum: ['pending', 'uploading', 'uploaded'] })
    f_status: 'pending' | 'uploaded' | "uploading" | null;

    @ManyToOne(() => User, user => user.files, { eager: true })

    @JoinColumn({ name: 'u_id' })
    user: Relation<User>;

    @OneToMany(() => Customer, customer => customer.file)
    customers: Customer[];

    @OneToMany(() => Queue, queue => queue.file)
    queue: Queue[];

}
