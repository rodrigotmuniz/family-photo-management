import { Album } from 'src/albums/entities/album.entity'
import { User } from 'src/auth/entities/user.entity'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, nullable: true })
  refId: number

  @Column()
  title: string

  @ManyToOne(() => Album)
  @JoinColumn()
  album: Album

  @ManyToOne(() => User)
  @JoinColumn()
  user: User

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
