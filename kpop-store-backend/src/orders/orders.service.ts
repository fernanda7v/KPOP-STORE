import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderDetail } from './entities/order-detail.entity';
import { Order, OrderStatus, PaymentMethod } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(OrderDetail)
    private readonly orderDetailsRepository: Repository<OrderDetail>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new BadRequestException('El pedido debe tener al menos un producto.');
    }

    const details: OrderDetail[] = [];
    let total = 0;
    let containsPreorder = false;

    for (const item of createOrderDto.items) {
      const product = await this.productsRepository.findOne({
        where: {
          id: item.productId,
          isActive: true,
        },
      });

      if (!product) {
        throw new NotFoundException(
          `Producto con ID ${item.productId} no encontrado o inactivo.`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para el producto: ${product.name}.`,
        );
      }

      const subtotal = product.price * item.quantity;
      total += subtotal;

      if (product.isPreorder) {
        containsPreorder = true;
      }

      product.stock = product.stock - item.quantity;
      await this.productsRepository.save(product);

      const detail = this.orderDetailsRepository.create({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      });

      details.push(detail);
    }

    const status =
      createOrderDto.paymentMethod === PaymentMethod.CONTRAENTREGA
        ? OrderStatus.PENDIENTE
        : OrderStatus.PAGADO;

    const order = this.ordersRepository.create({
      userId,
      fullName: createOrderDto.fullName.trim(),
      address: createOrderDto.address.trim(),
      city: createOrderDto.city.trim(),
      phone: createOrderDto.phone.trim(),
      paymentMethod: createOrderDto.paymentMethod,
      notes: createOrderDto.notes?.trim() ?? '',
      total,
      containsPreorder,
      status,
      details,
    });

    return this.ordersRepository.save(order);
  }

  async findMyOrders(userId: number) {
    return this.ordersRepository.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }

  async findAllAdmin() {
    return this.ordersRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number, userId: number, role: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado.');
    }

    if (role !== 'admin' && order.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para ver este pedido.');
    }

    return order;
  }

  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.ordersRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado.');
    }

    order.status = updateOrderStatusDto.status;
    return this.ordersRepository.save(order);
  }
}