import { Album } from 'src/albums/entities/album.entity'
import { Photo } from 'src/photos/entities/photo.entity'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  refId: number

  @Column({ unique: true })
  username: string

  @Column()
  password: string // Should be encrypted!!!! I am using the pain password just for this challenge

  @Column({ type: 'jsonb' })
  data: object

  @OneToMany(() => Album, (album) => album.user)
  albums: Album[]

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[]

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
