import { Entity, Column, PrimaryColumn, Index, ObjectIdColumn, CreateDateColumn } from 'typeorm';

@Entity('products')
@Index('sku_unique', ['sku'], { unique: true })
export class Product {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  sku: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  category: string;

  @Column()
  color: string;

  @Column('decimal')
  price: number;

  @Column()
  currency: string;

  @Column()
  stock: number;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn({ type: 'timestamp' }) // Se asigna automáticamente con la fecha actual del sistema
  creation_date: Date;
}
