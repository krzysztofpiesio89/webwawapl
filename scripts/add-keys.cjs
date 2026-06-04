const fs = require('fs');

const data = {
  pl: {
    yes: "Tak",
    no: "Nie",
    keys: {
      "producent": "Producent",
      "okres produkcji": "Okres Produkcji",
      "miejsce produkcji": "Miejsce Produkcji",
      "projektant": "Projektant",
      "silnik": "Silnik",
      "segment": "Segment",
      "platforma": "Platforma",
      "poprzednik": "Poprzednik",
      "następca": "Następca",
      "pokrewne": "Pokrewne",
      "typ nadwozia": "Typ Nadwozia",
      "napęd": "Napęd",
      "skrzynia biegów": "Skrzynia Biegów",
      "technologie": "Technologie"
    },
    values: {
      "gasoline": "Benzyna",
      "diesel": "Diesel",
      "hybrid": "Hybryda",
      "electric": "Elektryczny",
      "sedan": "Sedan",
      "suv": "SUV",
      "hatchback": "Hatchback",
      "coupe": "Coupe",
      "wagon": "Kombi",
      "convertible": "Kabriolet",
      "gasoline/hybrid": "Benzyna / Hybryda",
      "diesel/hybrid": "Diesel / Hybryda",
      "fwd": "FWD (Przód)",
      "rwd": "RWD (Tył)",
      "awd": "AWD (4x4)",
      "car": "Samochód"
    }
  },
  en: {
    yes: "Yes",
    no: "No",
    keys: {
      "producent": "Manufacturer",
      "okres produkcji": "Production Period",
      "miejsce produkcji": "Assembly",
      "projektant": "Designer",
      "silnik": "Engine",
      "segment": "Class",
      "platforma": "Platform",
      "poprzednik": "Predecessor",
      "następca": "Successor",
      "pokrewne": "Related",
      "typ nadwozia": "Body Style",
      "napęd": "Layout",
      "skrzynia biegów": "Transmission",
      "technologie": "Technologies"
    },
    values: {
      "gasoline": "Gasoline",
      "diesel": "Diesel",
      "hybrid": "Hybrid",
      "electric": "Electric",
      "sedan": "Sedan",
      "suv": "SUV",
      "hatchback": "Hatchback",
      "coupe": "Coupe",
      "wagon": "Wagon",
      "convertible": "Convertible",
      "gasoline/hybrid": "Gasoline / Hybrid",
      "diesel/hybrid": "Diesel / Hybrid",
      "fwd": "FWD",
      "rwd": "RWD",
      "awd": "AWD",
      "car": "Car"
    }
  },
  de: {
    yes: "Ja",
    no: "Nein",
    keys: {
      "producent": "Hersteller",
      "okres produkcji": "Produktionszeitraum",
      "miejsce produkcji": "Montage",
      "projektant": "Designer",
      "silnik": "Motor",
      "segment": "Klasse",
      "platforma": "Plattform",
      "poprzednik": "Vorgänger",
      "następca": "Nachfolger",
      "pokrewne": "Verwandte",
      "typ nadwozia": "Karosseriebauform",
      "napęd": "Antrieb",
      "skrzynia biegów": "Getriebe",
      "technologie": "Technologien"
    },
    values: {
      "gasoline": "Benzin",
      "diesel": "Diesel",
      "hybrid": "Hybrid",
      "electric": "Elektro",
      "sedan": "Limousine",
      "suv": "SUV",
      "hatchback": "Schrägheck",
      "coupe": "Coupé",
      "wagon": "Kombi",
      "convertible": "Cabriolet",
      "gasoline/hybrid": "Benzin / Hybrid",
      "diesel/hybrid": "Diesel / Hybrid",
      "fwd": "Frontantrieb",
      "rwd": "Heckantrieb",
      "awd": "Allradantrieb",
      "car": "Auto"
    }
  },
  uk: {
    yes: "Так",
    no: "Ні",
    keys: {
      "producent": "Виробник",
      "okres produkcji": "Період виробництва",
      "miejsce produkcji": "Місце виробництва",
      "projektant": "Дизайнер",
      "silnik": "Двигун",
      "segment": "Сегмент",
      "platforma": "Платформа",
      "poprzednik": "Попередник",
      "następca": "Наступник",
      "pokrewne": "Споріднені",
      "typ nadwozia": "Тип кузова",
      "napęd": "Привід",
      "skrzynia biegów": "Коробка передач",
      "technologie": "Технології"
    },
    values: {
      "gasoline": "Бензин",
      "diesel": "Дизель",
      "hybrid": "Гібрид",
      "electric": "Електро",
      "sedan": "Седан",
      "suv": "Позашляховик",
      "hatchback": "Хетчбек",
      "coupe": "Купе",
      "wagon": "Універсал",
      "convertible": "Кабріолет",
      "gasoline/hybrid": "Бензин / Гібрид",
      "diesel/hybrid": "Дизель / Гібрид",
      "fwd": "Передній (FWD)",
      "rwd": "Задній (RWD)",
      "awd": "Повний (AWD)",
      "car": "Авто"
    }
  },
  ru: {
    yes: "Да",
    no: "Нет",
    keys: {
      "producent": "Производитель",
      "okres produkcji": "Период производства",
      "miejsce produkcji": "Место производства",
      "projektant": "Дизайнер",
      "silnik": "Двигатель",
      "segment": "Сегмент",
      "platforma": "Платформа",
      "poprzednik": "Предшественник",
      "następca": "Преемник",
      "pokrewne": "Связанные",
      "typ nadwozia": "Тип кузова",
      "napęd": "Привод",
      "skrzynia biegów": "Коробка передач",
      "technologie": "Технологии"
    },
    values: {
      "gasoline": "Бензин",
      "diesel": "Дизель",
      "hybrid": "Гибрид",
      "electric": "Электро",
      "sedan": "Седан",
      "suv": "Внедорожник",
      "hatchback": "Хэтчбек",
      "coupe": "Купе",
      "wagon": "Универсал",
      "convertible": "Кабриолет",
      "gasoline/hybrid": "Бензин / Гибрид",
      "diesel/hybrid": "Дизель / Гибрид",
      "fwd": "Передний (FWD)",
      "rwd": "Задний (RWD)",
      "awd": "Полный (AWD)",
      "car": "Авто"
    }
  }
};

['pl', 'en', 'de', 'uk', 'ru'].forEach(lang => {
  const path = `./src/app/[lang]/dictionaries/${lang}.json`;
  const file = JSON.parse(fs.readFileSync(path, 'utf8'));
  file.citySeriesPage.yes = data[lang].yes;
  file.citySeriesPage.no = data[lang].no;
  file.citySeriesPage.keys = data[lang].keys;
  file.citySeriesPage.values = data[lang].values;
  fs.writeFileSync(path, JSON.stringify(file, null, 2));
});
