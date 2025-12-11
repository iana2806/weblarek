import './scss/styles.scss';

import { Products } from './components/base/Models/Products';
import { Cart } from './components/base/Models/Cart';
import { Buyer } from './components/base/Models/Buyer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { ApiService } from './components/base/Models/ApiService';
import { API_URL } from './utils/constants';

// Проверка работы модели Products
const productsModel = new Products();
productsModel.setProducts(apiProducts.items);

console.log('Массив товаров из каталога: ', productsModel.getProducts());
console.log(
	'Поиск товара по id: ',
	productsModel.getProductById(apiProducts.items[0].id)
);

productsModel.setSelectedProduct(apiProducts.items[1]);
console.log(
	'Товар, выбранный для подробного просмотра: ',
	productsModel.getSelectedProduct()
);

// Проверка работы модели Cart
const cartModel = new Cart();

cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
cartModel.addItem(apiProducts.items[2]);

console.log('Товары в корзине: ', cartModel.getItems());
console.log('Общая сумма товаров: ', cartModel.getTotal());
console.log('Количество товаров: ', cartModel.getCount());

cartModel.removeItem(apiProducts.items[0]);
console.log('Корзина после удаления одного товара: ', cartModel.getItems());

cartModel.clearCart();
console.log('Корзина после очистки: ', cartModel.getItems());

const firstProductId = apiProducts.items[0].id;
console.log(
	'Проверка наличия товара в корзине: ',
	cartModel.hasItem(firstProductId)
);
cartModel.addItem(apiProducts.items[0]);
console.log(
	'Проверка наличия товара в корзине: ',
	cartModel.hasItem(firstProductId)
);

// Проверка работы модели Buyer
const buyerModel = new Buyer();

buyerModel.setPayment('cash');
buyerModel.setAddress('Москва, ул. Ленина д. 1');
buyerModel.setEmail('test123@mail.ru');
buyerModel.setPhone('89112345678');

console.log('Данные покупателя: ', buyerModel.getData());
console.log('Валидация: ', buyerModel.validate());

buyerModel.clearData();
console.log('Данные после очистки: ', buyerModel.getData());

// Проверка работы Api
const api = new Api(API_URL);
const apiService = new ApiService(api);

try {
	const productsFromServer = await apiService.getProducts();
	productsModel.setProducts(productsFromServer);

	console.log(
		'Массив товаров, полученный с сервера: ',
		productsModel.getProducts()
	);
} catch (error) {
	console.error('Ошибка получения данных с сервера: ', error);
}
