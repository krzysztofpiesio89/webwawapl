import fs from 'fs';
import path from 'path';

const translations = {
  pl: {
    subject: "Potwierdzenie: Otrzymaliśmy zapytanie o wycenę pojazdu",
    greeting: "Witaj,",
    intro: "Dziękujemy za przesłanie zgłoszenia na stronie SkupAutWawa.pl. Poniżej znajduje się podsumowanie informacji, które nam przekazałeś:",
    detailsBrand: "Pojazd",
    detailsYear: "Rocznik",
    detailsEngine: "Silnik",
    detailsPrice: "Proponowana cena",
    detailsCity: "Lokalizacja",
    detailsPhone: "Twój telefon",
    nextStepsTitle: "Co dalej?",
    nextStepsText: "Nasz rzeczoznawca właśnie analizuje Twoje zgłoszenie. Skontaktujemy się z Tobą na podany numer telefonu w ciągu kilkunastu minut.",
    footer: "Z poważaniem, Zespół SkupAutWawa.pl",
    footerAddress: "Skup Aut Warszawa"
  },
  en: {
    subject: "Confirmation: We received your vehicle valuation request",
    greeting: "Hello,",
    intro: "Thank you for submitting your request on SkupAutWawa.pl. Below is a summary of the information you provided:",
    detailsBrand: "Vehicle",
    detailsYear: "Year",
    detailsEngine: "Engine",
    detailsPrice: "Proposed price",
    detailsCity: "Location",
    detailsPhone: "Your phone",
    nextStepsTitle: "What's next?",
    nextStepsText: "Our appraiser is currently reviewing your request. We will contact you at the provided phone number within 15 minutes.",
    footer: "Best regards, SkupAutWawa.pl Team",
    footerAddress: "Skup Aut Warszawa"
  },
  de: {
    subject: "Bestätigung: Wir haben Ihre Fahrzeugbewertungsanfrage erhalten",
    greeting: "Hallo,",
    intro: "Vielen Dank für Ihre Anfrage auf SkupAutWawa.pl. Nachfolgend finden Sie eine Zusammenfassung der von Ihnen angegebenen Informationen:",
    detailsBrand: "Fahrzeug",
    detailsYear: "Baujahr",
    detailsEngine: "Motor",
    detailsPrice: "Vorgeschlagener Preis",
    detailsCity: "Ort",
    detailsPhone: "Ihre Telefonnummer",
    nextStepsTitle: "Wie geht es weiter?",
    nextStepsText: "Unser Gutachter prüft Ihre Anfrage. Wir werden Sie innerhalb von 15 Minuten unter der angegebenen Telefonnummer kontaktieren.",
    footer: "Mit freundlichen Grüßen, Ihr SkupAutWawa.pl Team",
    footerAddress: "Skup Aut Warszawa"
  },
  ru: {
    subject: "Подтверждение: Мы получили ваш запрос на оценку автомобиля",
    greeting: "Здравствуйте,",
    intro: "Спасибо за вашу заявку на сайте SkupAutWawa.pl. Ниже приведено краткое изложение предоставленной вами информации:",
    detailsBrand: "Автомобиль",
    detailsYear: "Год выпуска",
    detailsEngine: "Двигатель",
    detailsPrice: "Предлагаемая цена",
    detailsCity: "Город",
    detailsPhone: "Ваш телефон",
    nextStepsTitle: "Что дальше?",
    nextStepsText: "Наш оценщик уже анализирует вашу заявку. Мы свяжемся с вами по указанному номеру телефона в течение 15 минут.",
    footer: "С уважением, Команда SkupAutWawa.pl",
    footerAddress: "Skup Aut Warszawa"
  },
  uk: {
    subject: "Підтвердження: Ми отримали ваш запит на оцінку автомобіля",
    greeting: "Вітаємо,",
    intro: "Дякуємо за вашу заявку на сайті SkupAutWawa.pl. Нижче наведено підсумок наданої вами інформації:",
    detailsBrand: "Автомобіль",
    detailsYear: "Рік випуску",
    detailsEngine: "Двигун",
    detailsPrice: "Запропонована ціна",
    detailsCity: "Місто",
    detailsPhone: "Ваш телефон",
    nextStepsTitle: "Що далі?",
    nextStepsText: "Наш оцінювач вже аналізує вашу заявку. Ми зв'яжемося з вами за вказаним номером телефону протягом 15 хвилин.",
    footer: "З повагою, Команда SkupAutWawa.pl",
    footerAddress: "Skup Aut Warszawa"
  },
  zh: {
    subject: "确认：我们已收到您的车辆评估请求",
    greeting: "您好，",
    intro: "感谢您在 SkupAutWawa.pl 上提交请求。以下是您提供的信息摘要：",
    detailsBrand: "车辆",
    detailsYear: "年份",
    detailsEngine: "发动机",
    detailsPrice: "建议价格",
    detailsCity: "地点",
    detailsPhone: "您的电话",
    nextStepsTitle: "下一步是什么？",
    nextStepsText: "我们的估价师正在审核您的请求。我们将在15分钟内通过您提供的电话号码与您联系。",
    footer: "此致，SkupAutWawa.pl 团队",
    footerAddress: "Skup Aut Warszawa"
  }
};

const langs = ['pl', 'en', 'de', 'ru', 'uk', 'zh'];
const basePath = path.join(process.cwd(), 'src', 'app', '[lang]', 'dictionaries');

langs.forEach(lang => {
  const filePath = path.join(basePath, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    data.email = translations[lang];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Updated ${lang}.json`);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});
