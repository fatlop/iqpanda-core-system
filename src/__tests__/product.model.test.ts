import Product from '../models/Product.model';

describe('Product Model', () => {
  describe('Validación de datos', () => {
    it('debe requerir campos obligatorios', () => {
      const producto = new Product({});
      const error = producto.validateSync();
      
      expect(error).toBeDefined();
      expect(error?.errors.nombre).toBeDefined();
      expect(error?.errors.codigo).toBeDefined();
      expect(error?.errors.categoria).toBeDefined();
      expect(error?.errors.precio).toBeDefined();
    });

    it('debe crear un producto válido', () => {
      const producto = new Product({
        nombre: 'Producto Test',
        codigo: 'TEST001',
        categoria: 'Test',
        precio: 10.99,
        cantidadDisponible: 100,
        unidadMedida: 'unidad'
      });
      
      const error = producto.validateSync();
      expect(error).toBeUndefined();
      expect(producto.nombre).toBe('Producto Test');
      expect(producto.activo).toBe(true);
    });

    it('no debe permitir precios negativos', () => {
      const producto = new Product({
        nombre: 'Producto Test',
        codigo: 'TEST002',
        categoria: 'Test',
        precio: -10,
        cantidadDisponible: 100,
        unidadMedida: 'unidad'
      });
      
      const error = producto.validateSync();
      expect(error).toBeDefined();
      expect(error?.errors.precio).toBeDefined();
    });
  });
});
