export const termsByRole = {
  B2C: {
    title: 'Terms & Conditions',
    subtitle: 'Agri Hitech Kisan',
    updated: '26/09/2026',
    sections: [
      { heading: '1. Service', body: 'Agri Hitech Kisan App provides information about medicines, seeds, irrigation, machinery, mandi prices and subsidy schemes.' },
      { heading: '2. Free Service', body: 'All information is currently free. Do not pay cash to anyone.' },
      { heading: '3. Main Disclaimer - No Liability', body: 'This App is for information purposes only. The App does not sell or manufacture any product. Product information and prices may be incorrect, and users must verify them independently. The App has no liability for any loss, crop damage or incident caused by a product. The user is fully responsible. Mandi prices change daily; confirm them with the local mandi.' },
      { heading: '4. Rights of Company', body: 'The company may modify or discontinue any feature without notice.' },
      { heading: '5. Information We Collect', body: 'We collect name, mobile number, district, crop and location only to provide relevant information.' },
      { heading: '6. Data Protection', body: 'We do not sell your data to any third party.' },
      { heading: '7. Data Deletion', body: 'You may request deletion of your data at any time by email.' },
    ],
  },
  B2B: {
    title: 'Terms & Conditions',
    subtitle: 'Agri Hitech Kisan',
    updated: '26/09/2026',
    sections: [
      { heading: '1. Registration', body: 'Dukaandar ko apni dukaan ka sahi naam, GST (yadi ho), pura pata, mobile number aur beche jane wale product (Beej, Dawa, Yantra) ki sahi jankari deni hogi. Galat jankari par ID band kar di jayegi.' },
      { heading: '2. Kisan ko Number Dikhana', body: 'Aapka registered mobile number najdeeki kisano ko dikhaya jayega. Kisan aapko product ki jankari ke liye call kar sakta hai. Kisan se sahi vyavhar karna aapki zimmedari hai.' },
      { heading: '3. Fees / Charges (Yearly / Monthly)', body: 'App par dukaan dikhane ke liye company aapse yearly ya monthly charge legi. Fees advance me dena hoga. Fees jama hone ke baad wapas nahi hogi (Non-Refundable). Agar aap fees nahi dete to aapki dukaan kisano ko dikhna band ho jayegi.' },
      { heading: '4. Wholesale Suvidha', body: 'Aap App ke madhyam se kisano ko ya anya dukaandaro ko thok me samaan bech sakte hain. Product ki kimat, stock, delivery aur payment ki puri zimmedari aapki hogi.' },
      { heading: '5. Product ki Zimmedari - No Liability of App', body: 'Aapke dwara beche gaye kisi bhi beej, dawa, yantra ki quality, asli-nakli, expiry aur warranty ki puri zimmedari aapki swayam ki hogi. Kisi bhi shikayat ya nuksan ki sthiti me Agri Hitech App ki koi jawabdaari nahi hogi.' },
      { heading: '6. Mana Hai', body: 'Nakli, ban ki hui dawa ya expiry product bechna sakht mana hai. Aisa karne par aapki ID hamesha ke liye band kar di jayegi.' },
      { heading: '7. Company ka Adhikar', body: 'Company bina suchna ke fees me badlav kar sakti hai aur kisi bhi dealer ka account band kar sakti hai.' },
    ],
  },
  COMPANY: {
    title: 'Terms & Conditions',
    subtitle: 'Agri Hitech Kisan',
    updated: '26/09/2026',
    sections: [
      { heading: '1. Company Registration', body: 'The company must provide the correct company name, GST certificate, business address, logo, mobile number and email ID. The ID will be activated only after verification.' },
      { heading: '2. Add Products', body: 'The company may add its own products such as seeds, pesticides, farm equipment and irrigation tools with photos, prices, features and warranty details. If any fake or misleading product is added, the ID will be permanently banned.' },
      { heading: '3. Fees / Charges (Monthly / Yearly)', body: 'To list the company and display products on the App, the App charges a monthly or yearly fee. Fees must be paid in advance and are non-refundable. If fees are not paid, all company products will stop appearing to farmers.' },
      { heading: '4. Add Dealer Numbers', body: 'The company may add the names and contact numbers of its authorised dealers or distributors so farmers can contact them directly. The company is fully responsible for dealer behaviour and service.' },
      { heading: '5. Product Liability - No Liability of App', body: 'The App is only a platform connecting companies with farmers. The App does not guarantee price, stock or quality. The company is solely responsible for product quality, delivery, warranty, service and any loss or damage to farmers. The App has no legal liability in any dispute.' },
      { heading: '6. Prohibited', body: 'Selling fake, banned or expired products, or publishing misleading advertisements, is strictly prohibited.' },
      { heading: '7. Rights of App', body: 'The App reserves the right to change charges or design and to block any company account without prior notice.' },
    ],
  },
};

export const getTermsForRole = role => termsByRole[role] || termsByRole.B2C;
