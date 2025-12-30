import { IProduct } from '../../types';
import { AppEvents } from '../../utils/constants';
import { IEvents } from '../base/Events';

export class Products {
	private products: IProduct[] = [];
	private selectedProduct: IProduct | null = null;

	constructor(private events: IEvents) {}

	setProducts(products: IProduct[]): void {
		this.products = products;
		this.events.emit(AppEvents.ProductsChanged, { products });
	}

	getProducts(): IProduct[] {
		return this.products;
	}

	getProductById(id: string): IProduct | undefined {
		return this.products.find(p => p.id === id);
	}

	setSelectedProduct(product: IProduct | null): void {
		this.selectedProduct = product;
	}

	getSelectedProduct(): IProduct | null {
		return this.selectedProduct;
	}
}
