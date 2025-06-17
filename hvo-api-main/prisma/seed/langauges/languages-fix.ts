import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const countryToLanguage = {
  "United States": "English",
  Canada: "English",
  "United Kingdom": "English",
  France: "French",
  Germany: "German",
  Spain: "Spanish",
  Italy: "Italian",
  China: "Chinese",
  India: "Hindi",
  Brazil: "Portuguese",
  Russia: "Russian",
  Australia: "English",
  Japan: "Japanese",
  Mexico: "Spanish",
  "South Africa": "Zulu",
  Argentina: "Spanish",
  "South Korea": "Korean",
  Nigeria: "English",
  "Saudi Arabia": "Arabic",
  Egypt: "Arabic",
  Turkey: "Turkish",
  Indonesia: "Indonesian",
  Thailand: "Thai",
  Vietnam: "Vietnamese",
  Philippines: "Filipino",
  Pakistan: "Urdu",
  Malaysia: "Malay",
  Singapore: "English",
  Kenya: "Swahili",
  Israel: "Hebrew",
  Greece: "Greek",
  Switzerland: "German",
  Sweden: "Swedish",
  Poland: "Polish",
  Netherlands: "Dutch",
  Ukraine: "Ukrainian",
  Norway: "Norwegian",
  Ireland: "Irish",
  Denmark: "Danish",
  Belgium: "Dutch",
  Finland: "Finnish",
  Portugal: "Portuguese",
  Chile: "Spanish",
  Peru: "Spanish",
  Colombia: "Spanish",
  Venezuela: "Spanish",
  "New Zealand": "English",
  "United Arab Emirates": "Arabic",
  Qatar: "Arabic",
  Hungary: "Hungarian",
  "Czech Republic": "Czech",
  Romania: "Romanian",
  Bulgaria: "Bulgarian",
  Croatia: "Croatian",
  Slovakia: "Slovak",
  Slovenia: "Slovene",
  Serbia: "Serbian",
  Austria: "German",
  Luxembourg: "Luxembourgish",
  Iceland: "Icelandic",
  Lithuania: "Lithuanian",
  Latvia: "Latvian",
  Estonia: "Estonian",
  Cyprus: "Greek",
  Malta: "Maltese",
  Montenegro: "Montenegrin",
  "North Macedonia": "Macedonian",
};

async function updateLanguages() {
  for (const [country, language] of Object.entries(countryToLanguage)) {
    await prisma.language.updateMany({
      where: { name: country },
      data: {
        countryName: country,
        name: language,
      },
    });
    console.log(`Updated: ${country} -> ${language}`);
  }
  console.log("Migration complete!");
}

updateLanguages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
