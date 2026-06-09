import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async getProductsByCategory() {
    const rows = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .select('category.name', 'category')
      .addSelect('COUNT(product.id)', 'total')
      .where('product.isActive = :isActive', { isActive: true })
      .groupBy('category.name')
      .orderBy('total', 'DESC')
      .getRawMany();

    return rows.map((row) => ({
      category: row.category ?? 'Sin categoría',
      total: Number(row.total),
    }));
  }

  async getOrdersByStatus() {
    const rows = await this.ordersRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(order.id)', 'total')
      .groupBy('order.status')
      .orderBy('total', 'DESC')
      .getRawMany();

    return rows.map((row) => ({
      status: row.status,
      total: Number(row.total),
    }));
  }

  async getDashboardSummary() {
    const activeProducts = await this.productsRepository.count({
      where: { isActive: true },
    });

    const inactiveProducts = await this.productsRepository.count({
      where: { isActive: false },
    });

    const totalOrders = await this.ordersRepository.count();

    const totalSalesRow = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .getRawOne();

    return {
      activeProducts,
      inactiveProducts,
      totalOrders,
      totalSales: Number(totalSalesRow.total ?? 0),
    };
  }
}