// Générateur procédural pour 30 000 médicaments
const realMedications = [
  {id: "1", name: "Paracétamol", class: "Analgésique", category: "analgesique", mechanism: "Inhibition prostaglandines", indications: "Douleur", immediate_effects: "Analésie", side_effects: "Rare", contraindications: "Hépatopathie", dosage: "500-1000mg", interactions: "Alcool"},
  {id: "2", name: "Ibuprofène", class: "AINS", category: "analgesique", mechanism: "Inhibition COX", indications: "Douleur", immediate_effects: "Anti-inflammatoire", side_effects: "Gastrique", contraindications: "Ulcère", dosage: "200-400mg", interactions: "Aspirine"},
  {id: "3", name: "Amoxicilline", class: "Pénicilline", category: "antibiotique", mechanism: "Inhibition paroi", indications: "Infections", immediate_effects: "Bactéricide", side_effects: "Allergie", contraindications: "Allergie", dosage: "500mg", interactions: "Méthotrexate"},
  {id: "4", name: "Lisinopril", class: "IEC", category: "cardiovasculaire", mechanism: "Inhibition ECA", indications: "HTA", immediate_effects: "Baisse PA", side_effects: "Toux", contraindications: "Grossesse", dosage: "10-40mg", interactions: "Diurétiques"},
  {id: "5", name: "Atorvastatine", class: "Statine", category: "cardiovasculaire", mechanism: "Inhibition HMG-CoA", indications: "Cholestérol", immediate_effects: "Baisse LDL", side_effects: "Myalgie", contraindications: "Hépatopathie", dosage: "10-80mg", interactions: "Fibrates"}
];

const prefixes = ["Acé","Al","Am","Ana","Anti","Apo","As","Aten","Ato","Aze","Bac","Ben","Bis","Brom","Bus","Cal","Car","Cef","Cel","Ceph","Chlor","Cip","Cis","Cla","Clo","Clop","Clox","Co","Cyclo","De","Des","Dex","Dia","Diclo","Dif","Dig","Dim","Dip","Dis","Do","Doc","Dol","Dop","Dox","Dul","Efa","En","Epo","Ery","Eso","Eta","Ete","Fam","Fen","Fento","Flu","Fluox","Fos","Furo","Gab","Gal","Gem","Gen","Gent","Gly","Gua","Hal","Hep","Hepa","Hydro","Ibu","Imi","Ind","Ipr","Iso","Keto","Lan","Lev","Lin","Lio","Lis","Lor","Los","Meb","Mel","Met","Meth","Mex","Mirt","Mo","Mol","Mono","Morph","Moxi","Nab","Nap","Nar","Neo","Neur","Ni","Nic","Nitro","Nor","Nort","Olan","Olo","Ome","Ond","Oxa","Oxy","Pal","Pan","Par","Peg","Pen","Pent","Per","Phen","Pip","Pir","Piz","Pra","Pras","Pro","Prop","Pyr","Quin","Ral","Ran","Ras","Re","Rhe","Ris","Rit","Riv","Ros","Rosu","Rox","Roxi","Sal","Sam","Sar","Sero","Ser","Set","Sil","Sim","Sit","Sodi","Sol","Soni","Spar","Spi","Spir","Sul","Sum","Suni","Suv","Sux","Tac","Tad","Tamo","Tan","Tas","Taz","Tel","Tem","Ten","Teno","Ter","Tetr","Theo","Thia","Thio","Tia","Tic","Tig","Til","Timo","Tin","Tio","Tir","Tiz","Tob","Tol","Top","Tor","Tra","Tri","Tro","Trop","Trov","Tul","Tyl","Tyro","Ume","Ura","Uro","Urs","Val","Vals","Van","Vap","Var","Vas","Vem","Ven","Ver","Vil","Vin","Vio","Vita","Vor","Vox","Xan","Xyl","Zaf","Zale","Zam","Zan","Zas","Zep","Zil","Zin","Zip","Zol","Zon","Zop","Zor","Zot","Zuc","Zul","Zup","Zur","Zyl","Zym","Zyp","Zyr","Zyt"];
const suffixes = ["pril","sartan","statine","mab","prazole","lol","xetine","zodone","zolam","zide","pine","lone","parine","linide","gliptin","gliflozin","cycline","mycin","floxacine","thromycin","azole","conazole","tinidazole","nidazole","bendazole","dazole","cilline","sporin","micin","lin"];
const classes = ["Analgésique","AINS","Antibiotique","IEC","ARA2","Bêta-bloquant","Diurétique","Statine","Antidiabétique","IPP","Antidépresseur","Benzodiazépine","Anticonvulsivant","Antipsychotique","Antiagrégant","Anticoagulant"];
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
  
  // Génération différée pour éviter le blocage
  setTimeout(() => {
    const proceduralMeds = generateProceduralMedications(29995);
    cachedMedications = [
      ...realMedications,
      ...proceduralMeds
    ];
    console.log(`Généré ${cachedMedications.length} médicaments`);
  }, 100);
  
  // Retourner les médicaments réels initialement
  cachedMedications = [...realMedications];
  return cachedMedications;
}

export const mockMedications = getMedications();
