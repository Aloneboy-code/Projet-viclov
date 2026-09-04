// Générateur procédural pour 35 000 médicaments
const realMedications = [
  {id: "1", name: "Paracétamol", class: "Analgésique", category: "analgesique", mechanism: "Inhibition prostaglandines", indications: "Douleur", immediate_effects: "Analgésie", side_effects: "Rares"},
  {id: "2", name: "Ibuprofène", class: "AINS", category: "analgesique", mechanism: "Inhibition COX", indications: "Douleur", immediate_effects: "Anti-inflammatoire", side_effects: "Gastrique"},
  {id: "3", name: "Amoxicilline", class: "Pénicilline", category: "antibiotique", mechanism: "Inhibition paroi", indications: "Infections", immediate_effects: "Bactéricide", side_effects: "Allergie"},
  {id: "4", name: "Lisinopril", class: "IEC", category: "cardiovasculaire", mechanism: "Inhibition ECA", indications: "HTA", immediate_effects: "Baisse PA", side_effects: "Toux"},
  {id: "5", name: "Atorvastatine", class: "Statine", category: "cardiovasculaire", mechanism: "Inhibition HMG-CoA", indications: "Cholestérol", immediate_effects: "Baisse LDL", side_effects: "Myalgie"}
];

const prefixes = ["Acé","Al","Am","Ana","Anti","Apo","As","Aten","Ato","Aze","Bac","Ben","Bis","Brom","Bus","Cal","Car","Cef","Cel","Ceph","Chlor","Cip","Cis","Cla","Clo","Clop","Clox","Co","Cycl"];
const suffixes = ["pril","sartan","statine","mab","prazole","lol","xetine","zodone","zolam","zide","pine","lone","parine","linide","gliptin","gliflozin","cycline","mycin","floxacine","thromycin"];
const classes = ["Analgésique","AINS","Antibiotique","IEC","ARA2","Bêta-bloquant","Diurétique","Statine","Antidiabétique","IPP","Antidépresseur","Benzodiazépine","Anticonvulsivant","Antipsychotique"];
const categories = ["analgesique","antibiotique","cardiovasculaire","antidiabetique","gastroentérologie","respiratoire","endocrinologie","psychiatrie","neurologie","immunologie"];

function generateProceduralMedications(count) {
  const meds = [];
  const usedNames = new Set(realMedications.map(m => m.name.toLowerCase()));
  
  let i = 0;
  while (meds.length < count && i < count * 100) {
    let name;
    let attempts = 0;
    
    do {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const middle = Math.random() > 0.3 ? prefixes[Math.floor(Math.random() * prefixes.length)] : "";
      const middle2 = Math.random() > 0.7 ? suffixes[Math.floor(Math.random() * suffixes.length)] : "";
      name = prefix + middle + middle2 + suffix;
      name = name.charAt(0).toUpperCase() + name.slice(1);
      attempts++;
    } while (usedNames.has(name.toLowerCase()) && attempts < 50);
    
    if (attempts < 50) {
      usedNames.add(name.toLowerCase());
      
      const drugClass = classes[Math.floor(Math.random() * classes.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      meds.push({
        id: (realMedications.length + meds.length + 1).toString(),
        name,
        class: drugClass,
        category,
        mechanism: "Mécanisme d'action standard",
        indications: "Indications thérapeutiques",
        immediate_effects: "Effets thérapeutiques",
        side_effects: "Effets secondaires possibles",
        contraindications: "Contre-indications",
        dosage: "Dosage standard",
        interactions: "Interactions médicamenteuses"
      });
    }
    i++;
  }
  
  return meds;
}

let cachedMedications = null;

export function getMedications() {
  if (cachedMedications) return cachedMedications;
  
  // Génération synchrone pour garantir tous les médicaments en un seul appel
  const proceduralMeds = generateProceduralMedications(29995);
  cachedMedications = [
    ...realMedications,
    ...proceduralMeds
  ];
  console.log(`✓ Généré ${cachedMedications.length} médicaments au total`);
  
  return cachedMedications;
}

// Pré-générer les médicaments au chargement du module
export const mockMedications = getMedications();
