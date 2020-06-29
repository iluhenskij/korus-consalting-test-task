// invoices.json
//добавил дополнительное представление в invoice.json в качестве примера
let invoices = `{
        "customer": "MDT",
        "performance": [
            {
                "playId": "Гамлет",
                "audience": 55,
                "type": "tragedy"
            },
            {
                "playId": "Ромео и Джульетта",
                "audience": 35,
                "type": "tragedy"
            },
            {
                "playId": "Отелло",
                "audience": 40,
                "type": "comedy"
            },
            {
                "playId": "santaAppearing", 
                "audience": 140,
                "type": "newYearParty"
            }
        ]
    }`
let parsedInvoice;
console.log(parsedInvoice = JSON.parse(invoices));

//форматирование для рубля
const formatter = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 2
    });

//храним данные о клиенте(в том числе кол-во бонусов в данном объете)
let customerList = {}

//считает стоимость представления c помозью объекта priceList
function calcPriceOfPerf(aPerf,amount){
    return priceList[aPerf.type](aPerf,amount)
}
//Позволяет добавлять калькуляцию стоимости для новых представлений и/или спецеальные предложения
let priceList = {
    comedy(aPerf,amount) {
        aPerf.audience > 20 ? amount += 10000 + 500 * (aPerf.audience - 20) : {};
        return amount + 30000 + (300 * aPerf.audience);
    },
    tragedy(aPerf,amount) {
        aPerf.audience > 30 ? amount += 1000 * (aPerf.audience - 30) : {};
        return amount + 40000
    },
    newYearParty(aPerf,amount) {
        aPerf.audience > 30 ? amount += 1000 * (aPerf.audience - 30) : {};
        return amount + 200000
    },
}

class Consumer{
    constructor(name= "NONAME",bonuses = 0) {
        this.consumerName = name
        this.priviousOrderds = []
        this.bonuses = bonuses
        this.totalDepences = 0
        customerList[name] = this;
    }
};
//обновляет информацию о действиях потребителя(бонусы,последнии покуки, потрачено за всё время)
function fillInfoAboutCustomer(inv,money,bonus){
    if(customerList.hasOwnProperty(inv.customer)){
        customerList[inv.customer].bonuses += bonus;
        customerList[inv.customer].priviousOrderds.push(...inv.performance);
        customerList[inv.customer].totalDepences += money;
    }else{
        new Consumer(inv.customer);
        customerList[inv.customer].bonuses += bonus;
        customerList[inv.customer].priviousOrderds.push(...inv.performance);
        customerList[inv.customer].totalDepences += money;
    }
}

//замена formatter позволяет форматировтаь стоимость для разных валют
function statement(invoice,aFormatter) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Счет для ${invoice.customer}\n`;
    for (let perf of invoice.performance) {
        let thisAmount = 0;
        thisAmount = calcPriceOfPerf(perf,thisAmount);
// Добавление бонусов
        volumeCredits += Math.max(perf.audience - 30, 0);
// Дополнительный бонус (за каждые 10 комедий ???) за каждых 5 зрителей комедии
        perf.type === "comedy" ? volumeCredits += Math.floor(perf.audience / 5):{};
// Вывод строки счета
        result += ` ${perf.playId}: ${aFormatter.format(thisAmount)}(${perf.audience} мест)\n`;
        totalAmount += thisAmount;
    }
    //обновляет информацию о действиях потребителя(бонусы,последнии покуки, потрачено за всё время)
    fillInfoAboutCustomer(invoice,totalAmount,volumeCredits)
    return result += `Итого с вас ${aFormatter.format(totalAmount)}\n Вы заработали ${volumeCredits} бонусов
(Накоплено за всё время ${customerList[invoice.customer].bonuses})`;
}
console.log(statement(parsedInvoice,formatter))


