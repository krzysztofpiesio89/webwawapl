const fs = require('fs');
const path = require('path');

const dictionaries = {
  pl: {
    uCarsPromo: {
      badge: "Licytacje z USA",
      titlePrefix: "Szukasz auta bez uszkodzeń?",
      titleHighlight: "Odpala i jeździ!",
      description: "Zamiast aut krajowych, licytuj bezpiecznie pojazdy z ubezpieczalni z <strong class=\"text-white\">uCars.pl</strong> i oszczędzaj.",
      ctaPrimary: "Przejdź do uCars",
      ctaSecondary: "Zobacz katalog",
      trustText: "Prezentowane oferty pochodzą z amerykańskich baz aukcyjnych Copart & IAAI. uCars.pl zapewnia pełną logistykę i dostarczenie auta pod wskazany adres.",
      carousel: {
        runAndDrive: "Odpala i Jeździ",
        importUSA: "USA IMPORT",
        mileage: "Przebieg:",
        condition: "Stan:",
        noDamage: "Brak uszkodzeń",
        normalWear: "Zużycie eksploatacyjne",
        buyNow: "\"Kup Teraz\":",
        bidOn: "Licytuj na uCars.pl",
        noData: "Brak danych"
      }
    },
    recentBuys: {
      badge: "Ostatnio na lawecie",
      title: "Ostatnio zakupione pojazdy",
      description: "Sprawdź auta, które niedawno kupiliśmy. Płacimy gotówką za każdy stan!",
      cashTag1: "Zakupione za gotówkę",
      cashTag2: "Ten też kupiony za gotówkę :)"
    }
  },
  en: {
    uCarsPromo: {
      badge: "Auctions from USA",
      titlePrefix: "Looking for a damage-free car?",
      titleHighlight: "Run & Drive!",
      description: "Instead of local cars, bid safely on insurance vehicles with <strong class=\"text-white\">uCars.pl</strong> and save money.",
      ctaPrimary: "Go to uCars",
      ctaSecondary: "View catalog",
      trustText: "Presented offers come from US auction bases Copart & IAAI. uCars.pl provides full logistics and delivery to your door.",
      carousel: {
        runAndDrive: "Run & Drive",
        importUSA: "USA IMPORT",
        mileage: "Mileage:",
        condition: "Condition:",
        noDamage: "No damage",
        normalWear: "Normal Wear",
        buyNow: "\"Buy Now\":",
        bidOn: "Bid on uCars.pl",
        noData: "No data"
      }
    },
    recentBuys: {
      badge: "Recently towed",
      title: "Recently Purchased Vehicles",
      description: "Check out the cars we bought recently. We pay cash for any condition!",
      cashTag1: "Bought for cash",
      cashTag2: "This one also bought for cash :)"
    }
  },
  uk: {
    uCarsPromo: {
      badge: "Аукціони з США",
      titlePrefix: "Шукаєте авто без пошкоджень?",
      titleHighlight: "Заводиться і їде!",
      description: "Замість місцевих авто, безпечно торгуйтесь за страхові автомобілі з <strong class=\"text-white\">uCars.pl</strong> та економте.",
      ctaPrimary: "Перейти на uCars",
      ctaSecondary: "Дивитись каталог",
      trustText: "Представлені пропозиції надходять з американських аукціонів Copart та IAAI. uCars.pl забезпечує повну логістику та доставку до дверей.",
      carousel: {
        runAndDrive: "Заводиться і їде",
        importUSA: "ІМПОРТ З США",
        mileage: "Пробіг:",
        condition: "Стан:",
        noDamage: "Без пошкоджень",
        normalWear: "Нормальний знос",
        buyNow: "\"Купити зараз\":",
        bidOn: "Зробити ставку на uCars.pl",
        noData: "Немає даних"
      }
    },
    recentBuys: {
      badge: "Нещодавно на евакуаторі",
      title: "Нещодавно придбані автомобілі",
      description: "Перегляньте авто, які ми нещодавно купили. Ми платимо готівкою за будь-який стан!",
      cashTag1: "Куплено за готівку",
      cashTag2: "Цей теж куплений за готівку :)"
    }
  },
  ru: {
    uCarsPromo: {
      badge: "Аукционы из США",
      titlePrefix: "Ищете авто без повреждений?",
      titleHighlight: "Заводится и едет!",
      description: "Вместо местных машин, безопасно делайте ставки на страховые автомобили с <strong class=\"text-white\">uCars.pl</strong> и экономьте.",
      ctaPrimary: "Перейти на uCars",
      ctaSecondary: "Смотреть каталог",
      trustText: "Представленные предложения поступают с американских аукционов Copart и IAAI. uCars.pl обеспечивает полную логистику и доставку.",
      carousel: {
        runAndDrive: "Заводится и едет",
        importUSA: "ИМПОРТ ИЗ США",
        mileage: "Пробег:",
        condition: "Состояние:",
        noDamage: "Без повреждений",
        normalWear: "Нормальный износ",
        buyNow: "\"Купить сейчас\":",
        bidOn: "Сделать ставку на uCars.pl",
        noData: "Нет данных"
      }
    },
    recentBuys: {
      badge: "Недавно на эвакуаторе",
      title: "Недавно приобретенные автомобили",
      description: "Посмотрите авто, которые мы недавно купили. Мы платим наличными за любое состояние!",
      cashTag1: "Куплено за наличные",
      cashTag2: "Этот тоже куплен за наличные :)"
    }
  },
  de: {
    uCarsPromo: {
      badge: "Auktionen aus den USA",
      titlePrefix: "Suchen Sie ein unbeschädigtes Auto?",
      titleHighlight: "Startet und fährt!",
      description: "Bieten Sie sicher auf Versicherungsfahrzeuge mit <strong class=\"text-white\">uCars.pl</strong> anstatt lokaler Autos und sparen Sie.",
      ctaPrimary: "Zu uCars gehen",
      ctaSecondary: "Katalog ansehen",
      trustText: "Die präsentierten Angebote stammen aus US-Auktionen Copart & IAAI. uCars.pl bietet volle Logistik und Lieferung an Ihre Tür.",
      carousel: {
        runAndDrive: "Startet und fährt",
        importUSA: "USA IMPORT",
        mileage: "Kilometerstand:",
        condition: "Zustand:",
        noDamage: "Keine Schäden",
        normalWear: "Normale Abnutzung",
        buyNow: "\"Jetzt kaufen\":",
        bidOn: "Bieten auf uCars.pl",
        noData: "Keine Daten"
      }
    },
    recentBuys: {
      badge: "Kürzlich abgeschleppt",
      title: "Kürzlich gekaufte Fahrzeuge",
      description: "Sehen Sie sich die Autos an, die wir kürzlich gekauft haben. Wir zahlen bar für jeden Zustand!",
      cashTag1: "Für Bargeld gekauft",
      cashTag2: "Dieser wurde auch bar gekauft :)"
    }
  },
  zh: {
    uCarsPromo: {
      badge: "来自美国的拍卖",
      titlePrefix: "正在寻找无损坏的汽车？",
      titleHighlight: "启动并行驶！",
      description: "不要买本地车，通过 <strong class=\"text-white\">uCars.pl</strong> 安全竞拍保险车辆并省钱。",
      ctaPrimary: "前往 uCars",
      ctaSecondary: "查看目录",
      trustText: "提供的报价来自美国拍卖库 Copart & IAAI。uCars.pl 提供全套物流和送车上门服务。",
      carousel: {
        runAndDrive: "启动并行驶",
        importUSA: "美国进口",
        mileage: "里程：",
        condition: "状态：",
        noDamage: "无损坏",
        normalWear: "正常磨损",
        buyNow: "\"立即购买\":",
        bidOn: "在 uCars.pl 上出价",
        noData: "没有数据"
      }
    },
    recentBuys: {
      badge: "最近拖走",
      title: "最近购买的车辆",
      description: "查看我们最近购买的汽车。任何车况我们都支付现金！",
      cashTag1: "现金购买",
      cashTag2: "这辆也是现金购买的 :)"
    }
  }
};

const dir = path.join(__dirname, '../src/app/[lang]/dictionaries');
for (const [lang, dict] of Object.entries(dictionaries)) {
  const filePath = path.join(dir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.uCarsPromo = dict.uCarsPromo;
    data.recentBuys = dict.recentBuys;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}
