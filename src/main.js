/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
    // @TODO: Расчет выручки от операции
    const { discount, sale_price, quantity } = purchase;
    return (sale_price * quantity) * (1 - (discount / 100));
}
//const peremennaya = object.peremennaya
/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    const { profit } = seller;
    if (index === 0) {
        return profit * 0.15;
    }
    else if (index === 1 || index === 2) {
        return profit * 0.1;
    }
    else if (index === total - 1) {
        return 0;
    } 
    else { // Для всех остальных
        return profit * 0.05;
    }
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {


    // @TODO: Проверка входных данных
    const { calculateRevenue, calculateBonus } = options;
    if (!data
        || !Array.isArray(data.sellers)
        || !data.sellers === 0
        || !data.purchase_records === 0
    ) {
        throw new Error('Некорректные входные данные');
    }


    // @TODO: Проверка наличия опций
    typeof options === 'object';
    typeof calculateRevenue === 'function';
    typeof calculateBonus === 'function';

    // @TODO: Подготовка промежуточных данных для сбора статистики
    const sellerStats = data.sellers.map(seller => ({ //новый массив с объектами продавцов
        id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        products_sold: {}
    }));


    // Заполним начальными данными


    // @TODO: Индексация продавцов и товаров для быстрого доступа
    const sellerIndex = data.sellers.reduce((accum, item) => ( { // Ключом будет id, значением — запись из sellerStats
        ...accum,
        [item.id] : sellerStats.find((element) => element.id === item.id)
    } ) , {}  ) ;
     const productIndex = data.products.reduce((accum, item) => ({
        ...accum,
        [item.sku] : item
     }), {}); // Ключом будет sku, значением — запись из data.products

     // @TODO: Расчет выручки и прибыли для каждого продавца
     data.purchase_records.forEach(record => { // Чек 
        const seller = sellerIndex[record.seller_id]; // Продавец
        // Увеличить количество продаж 
        seller.sales_count += 1;
        // Увеличить общую сумму всех продаж
        seller.revenue += record.total_amount;
        // Расчёт прибыли для каждого товара
        record.items.forEach(item => {
            const product = productIndex[item.sku]; // Товар

            // Посчитать себестоимость (cost) товара как product.purchase_price, умноженную на количество товаров из чека
            const cost = product.purchase_price * item.quantity;

            // Посчитать выручку (revenue) с учётом скидки через функцию calculateRevenue
            const revenue = calculateRevenue(item);

            // Посчитать прибыль: выручка минус себестоимость
            const profit = revenue - cost;

            // Увеличить общую накопленную прибыль (profit) у продавца  
            seller.profit += profit;

            // Учёт количества проданных товаров
            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }
            // По артикулу товара увеличить его проданное количество у продавца
            seller.products_sold[item.sku] += 1;

        });
 });
    // @TODO: Сортировка продавцов по прибыли
    sellerStats.sort((a, b) => b.profit - a.profit);

    // @TODO: Назначение премий на основе ранжирования
    sellerStats.forEach((item, index) => {
        item.bonus = calculateBonus(index,sellerStats.length,item);
        item.top_products = Object.entries(item.products_sold);
        item.top_products = item.top_products.map(element => ({
            sku:element[0],
            quantity: element[1]
        }));
        item.top_products.sort((a, b) => b.quantity - a.quantity);
    });
    
    // @TODO: Подготовка итоговой коллекции с нужными полями
    return sellerStats.map(seller => ({
        seller_id:`${seller.id}`,
        name: `${seller.name}`,
        revenue: +seller.revenue.toFixed(2),
        profit: +seller.profit.toFixed(2),
        sales_count: seller.sales_count,
        top_products: seller.top_products.slice(0, 10),
        bonus: +seller.bonus.toFixed(2)
    }));
}
