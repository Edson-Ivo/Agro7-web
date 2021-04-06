const test = () => {
  let inputs = '';
  const arr = [
    { water: 'Água (%)' },
    { calories: 'Calorias (Kcal)' },
    { protein: 'Proteína (g)' },
    { carbohydrate: 'Carboidrato (g)' },
    { dietary_fiber: 'Fibra Alimentar (g)' },
    { cholesterol: 'Colesterol (mg)' },
    { lipids: 'Lipídios (g)' },
    { saturated_fatty_acid: 'Ácido Graxo Saturado (g)' },
    { unsaturated_fatty_acid: 'Ácido Graxo Mono insaturado (g)' },
    { polyunsaturated_fatty_acid: 'Ácido Graxo Poli insaturado (g)' },
    { calcium: 'Cálcio (mg)' },
    { phosphorus: 'Fósforo (mg)' },
    { iron: 'Ferro (mg)' },
    { potassium: 'Potássio (mg)' },
    { sodium: 'Sódio (mg)' },
    { vitamin_b1: 'Vitamina B1 (mg)' },
    { vitamin_b2: 'Vitamina B2 (mg)' },
    { vitamin_b3: 'Vitamina B3 (mg)' },
    { vitamin_b6: 'Vitamina B6 (mg)' },
    { vitamin_c: 'Vitamina C (mg)' }
  ];

  arr.map(
    el =>
      (inputs += `  ${Object.keys(el)}: yup
      .number()
      .transform(value => (Number.isNaN(value) ? undefined : value))
      .positive('O campo ${
        el[Object.keys(el)]
      } deve ser um valor positivo').nullable(),`)
  );

  return inputs;
};

export default test;
