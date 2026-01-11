describe('Страница конструктора бургера', () => {

	const api = '**/api';

	beforeEach(() => {
		cy.intercept('GET', `${api}/ingredients*`, { fixture: 'ingredients.json' }).as(
			'getIngredients'
		);

		cy.intercept('GET', `${api}/auth/user*`, { fixture: 'user.json' }).as(
			'getUser'
		);

		cy.intercept('POST', `${api}/auth/login*`, { fixture: 'login.json' }).as(
			'login'
		);
		cy.intercept('POST', `${api}/orders*`, { fixture: 'order.json' }).as(
			'createOrder'
		);

		cy.visit('/');
		cy.wait('@getIngredients', { timeout: 20000 });
		cy.contains('Соберите бургер').should('exist');
	});

	
	it('Добавление ингредиента из списка ингредиентов в конструктор (булка + начинка)', () => {
		
		// Проверяем, что конструктор чист
		cy.contains('Выберите булки').should('exist');
		cy.contains('Выберите начинку').should('exist');

		cy.contains('Булка Тестовая').parents('li').contains('Добавить').click();
		cy.contains('Котлета Тестовая').parents('li').contains('Добавить').click();

		// Проверяем, что в конструкторе появились ингреденты
		cy.contains('Выберите булки').should('not.exist');
		cy.contains('Выберите начинку').should('not.exist');
	});

	it('Открытие и закрытие модального окна с описанием ингредиента', () => {
		
		// Открытие
		cy.contains('Булка Тестовая').click();
		cy.contains('Детали ингредиента').should('exist');
		cy.get('h3').contains('Булка Тестовая').should('exist');

		// Закрытие на крестик
		cy.contains('Детали ингредиента').parent().find('button').first().click();
		cy.contains('Детали ингредиента').should('not.exist');
	});

	it('Создание заказа, проверка очистки конструктора', () => {
		
		// Авторизуемся
		cy.contains('Личный кабинет').click();
		cy.contains('Вход').should('exist');
		cy.get('input[name="email"]').type('test@test.ru');
		cy.get('input[name="password"]').type('123456');
		cy.contains('Войти').click();
		cy.wait('@login');
		cy.contains('Конструктор').click();

		// Делаем заказ
		cy.wait('@getIngredients');
		cy.contains('Булка Тестовая').parents('li').contains('Добавить').click();
		cy.contains('Котлета Тестовая').parents('li').contains('Добавить').click();
		cy.contains('Оформить заказ').click();
		cy.wait('@createOrder');
		cy.contains('12345').should('exist');
		cy.get('body').type('{esc}');
		cy.contains('12345').should('not.exist');

		// Конструктор очищен (снова показываются подсказки)
		cy.contains('Выберите булки').should('exist');
		cy.contains('Выберите начинку').should('exist');
	});
	
});
