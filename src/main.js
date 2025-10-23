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
        sellerStats.sales_count += 1;
        // Увеличить общую сумму всех продаж
        sellerStats.revenue += record.total_amount;
        // Расчёт прибыли для каждого товара
        record.items.forEach(item => {
            const product = productIndex[item.sku]; // Товар
            console.log('product',product);
            console.log('productIndex',productIndex);
            // Посчитать себестоимость (cost) товара как product.purchase_price, умноженную на количество товаров из чека
            const cost = product.purchase_price * item.quantity;
            console.log('cost =',cost);
            // Посчитать выручку (revenue) с учётом скидки через функцию calculateRevenue
            sellerStats.revenue = calculateRevenue(item);
            console.log("revenue", sellerStats.revenue);
            // Посчитать прибыль: выручка минус себестоимость
        // Увеличить общую накопленную прибыль (profit) у продавца  

            // Учёт количества проданных товаров
            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }
            // По артикулу товара увеличить его проданное количество у продавца
        });
 });


    // @TODO: Сортировка продавцов по прибыли


    // @TODO: Назначение премий на основе ранжирования


    // @TODO: Подготовка итоговой коллекции с нужными полями
}
