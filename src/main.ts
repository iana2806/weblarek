import './scss/styles.scss';

import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

import { Api } from './components/base/Api';
import { ApiService } from './components/ApiService';
import { API_URL, CDN_URL, AppEvents } from './utils/constants';

import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate } from './utils/utils';

import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { CardCatalog } from './components/views/Card/CardCatalog';
import { CardPreview } from './components/views/Card/CardPreview';
import { CardBasket } from './components/views/Card/CardBasket';
import { FormOrder } from './components/views/Form/FormOrder';
import { FormContacts } from './components/views/Form/FormContacts';
import { Basket } from './components/views/Basket';
import { Modal } from './components/views/Modal';
import { Success } from './components/views/Success';
import { IBuyer, IProduct, TPayment } from './types';

// Создание событий
const events = new EventEmitter();

// Создание моделей
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

// Создание API
const api = new Api(API_URL);
const apiService = new ApiService(api);

// Создание шаблонов
const templateCardCatalog = ensureElement<HTMLTemplateElement>(
	'#card-catalog',
	document.body
);
const templateCardPreview = ensureElement<HTMLTemplateElement>(
	'#card-preview',
	document.body
);
const templateCardBasket = ensureElement<HTMLTemplateElement>(
	'#card-basket',
	document.body
);
const templateBasket = ensureElement<HTMLTemplateElement>(
	'#basket',
	document.body
);
const templateFormOrder = ensureElement<HTMLTemplateElement>(
	'#order',
	document.body
);
const templateFormContacts = ensureElement<HTMLTemplateElement>(
	'#contacts',
	document.body
);
const templateSuccess = ensureElement<HTMLTemplateElement>(
	'#success',
	document.body
);

//Создание контейнеров
const headerContainer = ensureElement<HTMLElement>('.header', document.body);
const galleryContainer = ensureElement<HTMLElement>('.gallery', document.body);
const modalContainer = ensureElement<HTMLElement>('.modal', document.body);

// Создание представлений
const header = new Header(events, headerContainer);
const gallery = new Gallery(events, galleryContainer);
const modal = new Modal(events, modalContainer);
const formOrder = new FormOrder(events, cloneTemplate(templateFormOrder));
const formContacts = new FormContacts(
	events,
	cloneTemplate(templateFormContacts)
);

// Загрузка товаров с сервера
async function loadProducts() {
	try {
		const productsFromServer = await apiService.getProducts();
		productsModel.setProducts(productsFromServer);
	} catch (error) {
		console.error('Ошибка получения данных с сервера: ', error);
	}
}

loadProducts();

// Создание каталога карточек
events.on(AppEvents.ProductsChanged, () => {
	const products = productsModel.getProducts();

	const cards = products.map(product => {
		const cardElement = cloneTemplate<HTMLElement>(templateCardCatalog);
		cardElement.dataset.id = product.id;

		const cardCatalog = new CardCatalog(events, cardElement);
		cardCatalog.title = product.title;
		cardCatalog.price = product.price;
		cardCatalog.category = product.category;
		cardCatalog.image = { src: CDN_URL + product.image, alt: product.title };

		return cardCatalog.render();
	});

	gallery.catalog = cards;
});

// Открытие карточки товара в модальном окне
events.on(AppEvents.CardPreview, ({ id }: { id: string }) => {
	const product = productsModel.getProductById(id);
	if (!product) return;

	const previewElement = cloneTemplate<HTMLElement>(templateCardPreview);
	previewElement.dataset.id = product.id;

	const cardPreview = new CardPreview(events, previewElement);
	cardPreview.title = product.title;
	cardPreview.price = product.price;
	cardPreview.category = product.category;
	cardPreview.description = product.description;
	cardPreview.image = { src: CDN_URL + product.image, alt: product.title };

	modal.content = cardPreview.render();
	modal.open();
});

// Добавление товаров в корзину
events.on(AppEvents.CardAdd, ({ id }: { id: string }) => {
	const product = productsModel.getProductById(id);
	if (!product) return;

	if (cartModel.hasItem(product.id)) {
		cartModel.removeItem(product);
	} else {
		cartModel.addItem(product);
	}

	header.counter = cartModel.getCount();
});

// Изменения в корзине
events.on(AppEvents.CartChanged, ({ item }: { item?: IProduct }) => {
	header.counter = cartModel.getCount();

	if (item) {
		events.emit(AppEvents.CartItemChanged, {
			id: item.id,
			inCart: cartModel.hasItem(item.id),
		});
	}
});

// Открытие корзины
events.on(AppEvents.BasketOpen, () => {
	const basketElement = cloneTemplate(templateBasket);

	const basketItems = cartModel.getItems().map((product, i) => {
		const cardBasketElement = cloneTemplate(templateCardBasket);
		cardBasketElement.dataset.id = product.id;

		const cardBasket = new CardBasket(events, cardBasketElement);
		cardBasket.index = i + 1;
		cardBasket.title = product.title;
		cardBasket.price = product.price;

		return cardBasket.render();
	});

	const basket = new Basket(events, basketElement);
	basket.items = basketItems;
	basket.total = cartModel.getTotal();

	if (cartModel.getItems().length === 0) {
		basket.disableOrderButton();
	} else {
		basket.enableOrderButton();
	}

	modal.content = basket.render();
	modal.open();
});

// Удаление товара из корзины
events.on(AppEvents.BasketRemove, ({ id }: { id: string }) => {
	const product = productsModel.getProductById(id);
	if (!product) return;

	cartModel.removeItem(product);
	header.counter = cartModel.getCount();
	events.emit(AppEvents.BasketOpen);
});

// Открытие формы заказа (первый шаг)
events.on(AppEvents.OrderOpen, () => {
	modal.content = formOrder.render();
	modal.open();
});

// Выбор способа оплаты
events.on(AppEvents.OrderPayment, ({ payment }: { payment: TPayment }) => {
	buyerModel.setPayment(payment);
});

// Ввод адреса
events.on(AppEvents.OrderAddress, ({ address }: { address: string }) => {
	buyerModel.setAddress(address);
});

// Второй шаг формы заказа
events.on(AppEvents.OrderNext, () => {
	modal.content = formContacts.render();
	modal.open();
});

// Ввод email
events.on(AppEvents.ContactsEmail, ({ email }: { email: string }) => {
	buyerModel.setEmail(email);
});

// Ввод телефона
events.on(AppEvents.ContactsPhone, ({ phone }: { phone: string }) => {
	buyerModel.setPhone(phone);
});

// Изменения в формах заказа
events.on(
	AppEvents.FormChanged,
	(data: { field?: keyof IBuyer; value?: any } = {}) => {
		const { field, value } = data;

		switch (field) {
			case 'payment':
				buyerModel.setPayment(value);
				break;

			case 'address':
				buyerModel.setAddress(value);
				break;

			case 'email':
				buyerModel.setEmail(value);
				break;

			case 'phone':
				buyerModel.setPhone(value);
				break;
		}
	}
);

// Отправка формы
events.on(AppEvents.FormSubmit, () => {
	const current = modal.content;
	const errors = buyerModel.validate();

	if (current instanceof FormOrder) {
		if (errors.payment || errors.address) {
			formOrder.showErrors(
				[errors.payment, errors.address].filter(Boolean).join(', ')
			);
			formOrder.disableSubmit();
			return;
		}

		modal.content = formContacts.render();
		return;
	}

	if (current instanceof FormContacts) {
		if (errors.email || errors.phone) {
			formContacts.showErrors(
				[errors.email, errors.phone].filter(Boolean).join(', ')
			);
			formContacts.disableSubmit();
			return;
		}

		events.emit(AppEvents.ContactsSubmit);
	}
});

// Отправка заказа и отображение экрана успеха
events.on(AppEvents.ContactsSubmit, async () => {
	const orderData = {
		...buyerModel.getData(),
		items: cartModel.getItems().map(item => item.id),
		total: cartModel.getTotal(),
	};

	try {
		await apiService.postOrder(orderData);

		const successElement = cloneTemplate(templateSuccess);
		const success = new Success(events, successElement);

		success.total = orderData.total;

		modal.content = success.render();
		modal.open();

		cartModel.clearCart();
		buyerModel.clearData();
	} catch (error) {
		console.error('Ошибка оформления заказа: ', error);
	}
});

// Изменения данных покупателя и валидация
events.on(AppEvents.BuyerChanged, () => {
	const data = buyerModel.getData();

	const orderErrors = buyerModel.validate();
	const hasOrderErrors = !!(orderErrors.payment || orderErrors.address);
	const orderErrorText = [orderErrors.payment, orderErrors.address]
		.filter(Boolean)
		.join(', ');

	formOrder.payment = data.payment;
	formOrder.address = data.address;

	if (hasOrderErrors) {
		formOrder.disableSubmit();
		formOrder.showErrors(orderErrorText);
	} else {
		formOrder.enableSubmit();
		formOrder.clearErrors();
	}

	const contactsErrors = buyerModel.validate();
	const hasContactsErrors = !!(contactsErrors.email || contactsErrors.phone);
	const contactsErrorText = [contactsErrors.email, contactsErrors.phone]
		.filter(Boolean)
		.join(', ');

	formContacts.email = data.email;
	formContacts.phone = data.phone;

	if (hasContactsErrors) {
		formContacts.disableSubmit();
		formContacts.showErrors(contactsErrorText);
	} else {
		formContacts.enableSubmit();
		formContacts.clearErrors();
	}
});

// Закрытие модального окна экрана успеха
events.on(AppEvents.SuccessClose, () => {
	header.counter = cartModel.getCount();
	modal.close();
});
