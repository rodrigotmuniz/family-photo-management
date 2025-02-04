import { User } from 'src/auth/entities/user.entity'
import { Photo } from 'src/photos/entities/photo.entity'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, nullable: true })
  refId: number

  @Column()
  title:string

  @ManyToOne(() => User)
  @JoinColumn()
  user: User

  @OneToMany(() => Photo, (photo) => photo.album)
  photos: Photo[]

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
