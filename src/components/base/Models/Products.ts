import { IProduct } from '../../../types';

export class Products {
	private products: IProduct[] = [];
	private selectedProduct: IProduct | null = null;

	setProducts(products: IProduct[]): void {
		this.products = products;
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
