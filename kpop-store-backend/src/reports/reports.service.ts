import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PDFDocument from 'pdfkit';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async generateProductsPdf(): Promise<Buffer> {
    const products = await this.productsRepository.find({
      order: { id: 'ASC' },
    });

    return new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
      });

      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(18).text('Reporte de Productos Registrados', {
        align: 'center',
      });

      doc.moveDown();

      doc.fontSize(10).text(`Fecha de generación: ${new Date().toLocaleString('es-BO')}`, {
        align: 'right',
      });

      doc.moveDown();

      doc.fontSize(12).text('Sistema Web de Gestión y Venta de Productos K-pop y BTS');

      doc.moveDown();

      doc.fontSize(11).text(`Total de productos registrados: ${products.length}`);

      doc.moveDown();

      products.forEach((product, index) => {
        doc
          .fontSize(12)
          .fillColor('#4b2a72')
          .text(`${index + 1}. ${product.name}`);

        doc
          .fontSize(10)
          .fillColor('#000000')
          .text(`Artista/Grupo: ${product.artist}`)
          .text(`Categoría: ${product.category ? product.category.name : 'Sin categoría'}`)
          .text(`Precio: Bs ${product.price}`)
          .text(`Stock: ${product.stock}`)
          .text(`Destacado: ${product.featured ? 'Sí' : 'No'}`)
          .text(`Preventa: ${product.isPreorder ? 'Sí' : 'No'}`)
          .text(`Estado: ${product.isActive ? 'Activo' : 'Inactivo'}`);

        if (product.estimatedDelivery) {
          doc.text(`Entrega estimada: ${product.estimatedDelivery}`);
        }

        doc
          .moveDown(0.5)
          .strokeColor('#dddddd')
          .moveTo(40, doc.y)
          .lineTo(555, doc.y)
          .stroke();

        doc.moveDown();
      });

      if (products.length === 0) {
        doc.fontSize(12).text('No existen productos registrados.');
      }

      doc.end();
    });
  }
}