// Tax information by country
export interface TaxInfo {
  name: string;
  code: string;
  rate: number;
  format: string;
  description: string;
}

export const countryTaxSystems: Record<string, TaxInfo> = {
  "US": {
    name: "Sales Tax",
    code: "ST",
    rate: 7.25, // Average US sales tax
    format: "XX-XXXXXXX",
    description: "US Sales Tax varies by state and locality"
  },
  "CA": {
    name: "GST/HST",
    code: "GST",
    rate: 5, // Federal GST
    format: "XXXXXXXXX RT XXXX",
    description: "Canadian Goods and Services Tax"
  },
  "GB": {
    name: "VAT",
    code: "VAT",
    rate: 20,
    format: "GB XXXXXXXXX",
    description: "UK Value Added Tax"
  },
  "AU": {
    name: "GST",
    code: "GST",
    rate: 10,
    format: "XX XXX XXX XXX",
    description: "Australian Goods and Services Tax"
  },
  "DE": {
    name: "VAT",
    code: "USt",
    rate: 19,
    format: "DE XXXXXXXXX",
    description: "German Value Added Tax (Umsatzsteuer)"
  },
  "FR": {
    name: "VAT",
    code: "TVA",
    rate: 20,
    format: "FR XXXXXXXXXXXX",
    description: "French Value Added Tax (Taxe sur la Valeur Ajoutée)"
  },
  "IT": {
    name: "VAT",
    code: "IVA",
    rate: 22,
    format: "IT XXXXXXXXXXX",
    description: "Italian Value Added Tax (Imposta sul Valore Aggiunto)"
  },
  "ES": {
    name: "VAT",
    code: "IVA",
    rate: 21,
    format: "ES XXXXXXXXX",
    description: "Spanish Value Added Tax (Impuesto sobre el Valor Añadido)"
  },
  "JP": {
    name: "Consumption Tax",
    code: "CT",
    rate: 10,
    format: "T XXXXXXXXX",
    description: "Japanese Consumption Tax (消費税, Shōhizei)"
  },
  "IN": {
    name: "GST",
    code: "GST",
    rate: 18, // Standard rate for most services
    format: "XX XXXXXXXXXXXXX",
    description: "Indian Goods and Services Tax"
  },
  "SG": {
    name: "GST",
    code: "GST",
    rate: 8,
    format: "MXXXXXXXXX",
    description: "Singapore Goods and Services Tax"
  },
  "NZ": {
    name: "GST",
    code: "GST",
    rate: 15,
    format: "XX-XXX-XXX",
    description: "New Zealand Goods and Services Tax"
  },
  "ZA": {
    name: "VAT",
    code: "VAT",
    rate: 15,
    format: "XXXXXXXXXX",
    description: "South African Value Added Tax"
  },
  "BR": {
    name: "ICMS",
    code: "ICMS",
    rate: 17, // Varies by state
    format: "XX.XXX.XXX/XXXX-XX",
    description: "Brazilian Tax on Circulation of Goods and Services"
  },
  "MX": {
    name: "IVA",
    code: "IVA",
    rate: 16,
    format: "XXXX XXXXXX XXX",
    description: "Mexican Value Added Tax (Impuesto al Valor Agregado)"
  }
};

// Get a list of countries for dropdown
export const getCountryList = () => {
  return Object.entries(countryTaxSystems).map(([code, info]) => ({
    code,
    name: getCountryName(code)
  }));
};

// Get country name from country code
export const getCountryName = (code: string): string => {
  const countryNames: Record<string, string> = {
    "US": "United States",
    "CA": "Canada",
    "GB": "United Kingdom",
    "AU": "Australia",
    "DE": "Germany",
    "FR": "France",
    "IT": "Italy",
    "ES": "Spain",
    "JP": "Japan",
    "IN": "India",
    "SG": "Singapore",
    "NZ": "New Zealand",
    "ZA": "South Africa",
    "BR": "Brazil",
    "MX": "Mexico"
  };
  
  return countryNames[code] || code;
};

// Generate a random tax number based on the country format
export const generateTaxNumber = (countryCode: string): string => {
  const taxInfo = countryTaxSystems[countryCode];
  if (!taxInfo) return "";
  
  const format = taxInfo.format;
  let taxNumber = "";
  
  for (const char of format) {
    if (char === "X") {
      taxNumber += Math.floor(Math.random() * 10).toString();
    } else {
      taxNumber += char;
    }
  }
  
  return taxNumber;
};

// Calculate tax amount based on country and subtotal
export const calculateTax = (countryCode: string, subtotal: number): number => {
  const taxInfo = countryTaxSystems[countryCode];
  if (!taxInfo) return 0;
  
  return (subtotal * taxInfo.rate) / 100;
}; 