// Générateur procédural pour 15 000 termes médicaux
// Combine 100 termes réels + génération procédurale

// 100 termes médicaux réels essentiels
const realMedicalTerms = [
  {term: "Anatomie", definition: "Étude de la structure des organismes vivants", etymology: "Du grec anatomê, dissection", organ: "Corps entier", specialty: "Médecine générale", category: "anatomie"},
  {term: "Physiologie", definition: "Étude des fonctions des organismes vivants", etymology: "Du grec physis, nature, et logos, étude", organ: "Corps entier", specialty: "Médecine générale", category: "physiologie"},
  {term: "Pathologie", definition: "Étude des maladies et de leurs causes", etymology: "Du grec pathos, souffrance, et logos, étude", organ: "Corps entier", specialty: "Médecine générale", category: "pathologie"},
  {term: "Cardiologie", definition: "Étude du cœur et des maladies cardiaques", etymology: "Du grec kardia, cœur", organ: "Cœur", specialty: "Cardiologie", category: "cardiologie"},
  {term: "Neurologie", definition: "Étude du système nerveux et de ses maladies", etymology: "Du grec neuron, nerf", organ: "Système nerveux", specialty: "Neurologie", category: "neurologie"},
  {term: "Pneumologie", definition: "Étude des poumons et des maladies respiratoires", etymology: "Du grec pneumon, poumon", organ: "Poumons", specialty: "Pneumologie", category: "anatomie"},
  {term: "Gastroentérologie", definition: "Étude de l'appareil digestif", etymology: "Du grec gaster, estomac, et enteron, intestin", organ: "Appareil digestif", specialty: "Gastroentérologie", category: "anatomie"},
  {term: "Néphrologie", definition: "Étude des reins et des maladies rénales", etymology: "Du grec nephros, rein", organ: "Reins", specialty: "Néphrologie", category: "anatomie"},
  {term: "Endocrinologie", definition: "Étude des glandes endocrines et des hormones", etymology: "Du grec endon, dedans, et krinein, sécréter", organ: "Glandes", specialty: "Endocrinologie", category: "physiologie"},
  {term: "Hématologie", definition: "Étude du sang et des maladies sanguines", etymology: "Du grec haima, sang", organ: "Sang", specialty: "Hématologie", category: "physiologie"},
  {term: "Oncologie", definition: "Étude des tumeurs et des cancers", etymology: "Du grec onkos, tumeur", organ: "Corps entier", specialty: "Oncologie", category: "pathologie"},
  {term: "Rhumatologie", definition: "Étude des maladies rhumatismales", etymology: "Du grec rheuma, écoulement", organ: "Articulations", specialty: "Rhumatologie", category: "pathologie"},
  {term: "Dermatologie", definition: "Étude de la peau et de ses maladies", etymology: "Du grec derma, peau", organ: "Peau", specialty: "Dermatologie", category: "anatomie"},
  {term: "Ophtalmologie", definition: "Étude de l'œil et de ses maladies", etymology: "Du grec ophthalmos, œil", organ: "Œil", specialty: "Ophtalmologie", category: "anatomie"},
  {term: "Otorhinolaryngologie", definition: "Étude de l'oreille, du nez et de la gorge", etymology: "Du grec oto, oreille, rhino, nez, larynx, gorge", organ: "ORL", specialty: "ORL", category: "anatomie"},
  {term: "Psychiatrie", definition: "Étude des maladies mentales", etymology: "Du grec psyché, âme, et iatreia, guérison", organ: "Cerveau", specialty: "Psychiatrie", category: "neurologie"},
  {term: "Pédiatrie", definition: "Médecine des enfants", etymology: "Du grec pais, enfant", organ: "Corps entier", specialty: "Pédiatrie", category: "médecine générale"},
  {term: "Gériatrie", definition: "Médecine des personnes âgées", etymology: "Du grec geras, vieillesse", organ: "Corps entier", specialty: "Gériatrie", category: "médecine générale"},
  {term: "Obstétrique", definition: "Étude de l'accouchement", etymology: "Du latin obstetrix, accoucheuse", organ: "Appareil reproducteur", specialty: "Obstétrique", category: "embryologie"},
  {term: "Gynécologie", definition: "Étude des maladies de l'appareil reproducteur féminin", etymology: "Du grec gyné, femme", organ: "Appareil reproducteur", specialty: "Gynécologie", category: "anatomie"},
  {term: "Urologie", definition: "Étude de l'appareil urinaire", etymology: "Du grec ouron, urine", organ: "Appareil urinaire", specialty: "Urologie", category: "anatomie"},
  {term: "Chirurgie", definition: "Traitement des maladies par opération", etymology: "Du grec cheir, main, et ergon, travail", organ: "Corps entier", specialty: "Chirurgie", category: "médecine générale"},
  {term: "Anesthésie", definition: "Insensibilité à la douleur", etymology: "Du grec an, sans, et aisthesis, sensation", organ: "Système nerveux", specialty: "Anesthésiologie", category: "pharmacologie"},
  {term: "Radiologie", definition: "Utilisation des rayons X pour le diagnostic", etymology: "Du latin radius, rayon", organ: "Corps entier", specialty: "Radiologie", category: "médecine générale"},
  {term: "Médecine légale", definition: "Application de la médecine au droit", etymology: "Du latin legalis, légal", organ: "Corps entier", specialty: "Médecine légale", category: "médecine générale"},
  {term: "Santé publique", definition: "Étude de la santé des populations", etymology: "Du latin sanitas, santé", organ: "Population", specialty: "Santé publique", category: "médecine générale"},
  {term: "Épidémiologie", definition: "Étude des maladies dans les populations", etymology: "Du grec epi, sur, demos, peuple", organ: "Population", specialty: "Épidémiologie", category: "pathologie"},
  {term: "Pharmacologie", definition: "Étude des médicaments", etymology: "Du grec pharmakon, médicament", organ: "Corps entier", specialty: "Pharmacologie", category: "pharmacologie"},
  {term: "Toxicologie", definition: "Étude des poisons", etymology: "Du grec toxikon, poison", organ: "Corps entier", specialty: "Toxicologie", category: "pharmacologie"},
  {term: "Microbiologie", definition: "Étude des micro-organismes", etymology: "Du grec mikros, petit, et bios, vie", organ: "Micro-organismes", specialty: "Microbiologie", category: "microbiologie"},
  {term: "Virologie", definition: "Étude des virus", etymology: "Du latin virus, poison", organ: "Virus", specialty: "Virologie", category: "microbiologie"},
  {term: "Bactériologie", definition: "Étude des bactéries", etymology: "Du grec bakterion, bâtonnet", organ: "Bactéries", specialty: "Bactériologie", category: "microbiologie"},
  {term: "Parasitologie", definition: "Étude des parasites", etymology: "Du grec parasitos, parasite", organ: "Parasites", specialty: "Parasitologie", category: "microbiologie"},
  {term: "Mycologie", definition: "Étude des champignons", etymology: "Du grec mykes, champignon", organ: "Champignons", specialty: "Mycologie", category: "microbiologie"},
  {term: "Immunologie", definition: "Étude du système immunitaire", etymology: "Du latin immunis, exempt", organ: "Système immunitaire", specialty: "Immunologie", category: "physiologie"},
  {term: "Génétique", definition: "Étude des gènes et de l'hérédité", etymology: "Du grec genesis, origine", organ: "Cellules", specialty: "Génétique", category: "biochimie"},
  {term: "Biochimie", definition: "Étude des processus chimiques dans les organismes", etymology: "Du grec bios, vie, et chemeia", organ: "Cellules", specialty: "Biochimie", category: "biochimie"},
  {term: "Biologie moléculaire", definition: "Étude des molécules biologiques", etymology: "Du latin molecula, petite masse", organ: "Cellules", specialty: "Biologie moléculaire", category: "biochimie"},
  {term: "Histologie", definition: "Étude des tissus", etymology: "Du grec histos, tissu", organ: "Tissus", specialty: "Histologie", category: "histologie"},
  {term: "Cytologie", definition: "Étude des cellules", etymology: "Du grec kytos, cellule", organ: "Cellules", specialty: "Cytologie", category: "biochimie"},
  {term: "Embryologie", definition: "Étude du développement embryonnaire", etymology: "Du grec embryon, embryon", organ: "Embryon", specialty: "Embryologie", category: "embryologie"},
  {term: "Anatomopathologie", definition: "Étude microscopique des tissus malades", etymology: "Combinaison d'anatomie et pathologie", organ: "Tissus", specialty: "Anatomopathologie", category: "pathologie"},
  {term: "Médecine nucléaire", definition: "Utilisation de substances radioactives", etymology: "Du latin nucleus, noyau", organ: "Corps entier", specialty: "Médecine nucléaire", category: "médecine générale"},
  {term: "Médecine d'urgence", definition: "Traitement des urgences médicales", etymology: "Du latin urgens, urgent", organ: "Corps entier", specialty: "Médecine d'urgence", category: "médecine générale"},
  {term: "Réanimation", definition: "Traitement des états critiques", etymology: "Du latin re, encore, et anima, âme", organ: "Corps entier", specialty: "Réanimation", category: "médecine générale"},
  {term: "Médecine interne", definition: "Étude des maladies internes", etymology: "Du latin internus, intérieur", organ: "Organes internes", specialty: "Médecine interne", category: "médecine générale"},
  {term: "Médecine du travail", definition: "Étude des maladies professionnelles", etymology: "Du latin labor, travail", organ: "Corps entier", specialty: "Médecine du travail", category: "médecine générale"},
  {term: "Médecine sportive", definition: "Médecine appliquée au sport", etymology: "Du latin sportus, divertissement", organ: "Corps entier", specialty: "Médecine sportive", category: "médecine générale"},
  {term: "Médecine tropicale", definition: "Étude des maladies tropicales", etymology: "Du latin tropicus, tropical", organ: "Corps entier", specialty: "Médecine tropicale", category: "pathologie"},
  {term: "Médecine préventive", definition: "Prévention des maladies", etymology: "Du latin praeventio, prévention", organ: "Corps entier", specialty: "Médecine préventive", category: "médecine générale"},
  {term: "Nutrition", definition: "Étude de l'alimentation", etymology: "Du latin nutritio, nutrition", organ: "Appareil digestif", specialty: "Nutrition", category: "physiologie"},
  {term: "Diététique", definition: "Science de l'alimentation équilibrée", etymology: "Du grec diaita, régime", organ: "Appareil digestif", specialty: "Diététique", category: "physiologie"},
  {term: "Addictologie", definition: "Étude des addictions", etymology: "Du latin addictio, attachement", organ: "Cerveau", specialty: "Addictologie", category: "neurologie"},
  {term: "Sexologie", definition: "Étude de la sexualité", etymology: "Du latin sexus, sexe", organ: "Appareil reproducteur", specialty: "Sexologie", category: "physiologie"},
  {term: "Médecine esthétique", definition: "Amélioration de l'apparence", etymology: "Du grec aisthetikos, esthétique", organ: "Peau", specialty: "Médecine esthétique", category: "médecine générale"},
  {term: "Médecine traditionnelle", definition: "Pratiques médicales traditionnelles", etymology: "Du latin traditio, tradition", organ: "Corps entier", specialty: "Médecine traditionnelle", category: "médecine générale"},
  {term: "Médecine alternative", definition: "Thérapies alternatives", etymology: "Du latin alter, autre", organ: "Corps entier", specialty: "Médecine alternative", category: "médecine générale"},
  {term: "Acupuncture", definition: "Thérapie par aiguilles", etymology: "Du latin acus, aiguille, et pungere, piquer", organ: "Corps entier", specialty: "Acupuncture", category: "médecine traditionnelle"},
  {term: "Homéopathie", definition: "Traitement par similitude", etymology: "Du grec homoios, semblable, et pathos, souffrance", organ: "Corps entier", specialty: "Homéopathie", category: "médecine alternative"},
  {term: "Ostéopathie", definition: "Manipulation des os", etymology: "Du grec osteon, os, et pathos, souffrance", organ: "Squelette", specialty: "Ostéopathie", category: "médecine alternative"},
  {term: "Chiropraxie", definition: "Manipulation vertébrale", etymology: "Du grec cheir, main, et praxis, action", organ: "Colonne vertébrale", specialty: "Chiropraxie", category: "médecine alternative"},
  {term: "Kinésithérapie", definition: "Thérapie par le mouvement", etymology: "Du grec kinesis, mouvement", organ: "Muscles", specialty: "Kinésithérapie", category: "physiologie"},
  {term: "Ergothérapie", definition: "Thérapie par l'activité", etymology: "Du grec ergon, travail", organ: "Corps entier", specialty: "Ergothérapie", category: "médecine générale"},
  {term: "Orthophonie", definition: "Thérapie du langage", etymology: "Du grec orthos, droit, et phone, voix", organ: "Appareil phonatoire", specialty: "Orthophonie", category: "médecine générale"},
  {term: "Psychologie", definition: "Étude de l'esprit", etymology: "Du grec psyché, âme", organ: "Cerveau", specialty: "Psychologie", category: "neurologie"},
  {term: "Psychothérapie", definition: "Thérapie de l'esprit", etymology: "Du grec psyché, âme, et therapeia, guérison", organ: "Cerveau", specialty: "Psychothérapie", category: "neurologie"},
  {term: "Hypnose", definition: "État modifié de conscience", etymology: "Du grec hypnos, sommeil", organ: "Cerveau", specialty: "Hypnose", category: "neurologie"},
  {term: "Méditation", definition: "Pratique de concentration", etymology: "Du latin meditatio, méditation", organ: "Cerveau", specialty: "Méditation", category: "neurologie"},
  {term: "Yoga", definition: "Pratique corporelle et mentale", etymology: "Du sanskrit yoga, union", organ: "Corps entier", specialty: "Yoga", category: "médecine traditionnelle"},
  {term: "Tai-chi", definition: "Art martial chinois", etymology: "Du chinois tai, grand, et chi, énergie", organ: "Corps entier", specialty: "Tai-chi", category: "médecine traditionnelle"},
  {term: "Qi Gong", definition: "Exercice énergétique chinois", etymology: "Du chinois qi, énergie, et gong, travail", organ: "Corps entier", specialty: "Qi Gong", category: "médecine traditionnelle"},
  {term: "Ayurveda", definition: "Médecine traditionnelle indienne", etymology: "Du sanskrit ayur, vie, et veda, connaissance", organ: "Corps entier", specialty: "Ayurveda", category: "médecine traditionnelle"},
  {term: "Médecine chinoise", definition: "Médecine traditionnelle chinoise", etymology: "De Chine", organ: "Corps entier", specialty: "Médecine chinoise", category: "médecine traditionnelle"},
  {term: "Médecine arabe", definition: "Médecine traditionnelle arabe", etymology: "Du monde arabe", organ: "Corps entier", specialty: "Médecine arabe", category: "médecine traditionnelle"},
  {term: "Médecine africaine", definition: "Médecine traditionnelle africaine", etymology: "D'Afrique", organ: "Corps entier", specialty: "Médecine africaine", category: "médecine traditionnelle"},
  {term: "Médecine amérindienne", definition: "Médecine traditionnelle amérindienne", etymology: "Des Amérindiens", organ: "Corps entier", specialty: "Médecine amérindienne", category: "médecine traditionnelle"},
  {term: "Médecine aborigène", definition: "Médecine traditionnelle aborigène", etymology: "Des Aborigènes", organ: "Corps entier", specialty: "Médecine aborigène", category: "médecine traditionnelle"},
  {term: "Phytothérapie", definition: "Traitement par les plantes", etymology: "Du grec phyton, plante", organ: "Corps entier", specialty: "Phytothérapie", category: "pharmacologie"},
  {term: "Aromathérapie", definition: "Traitement par les huiles essentielles", etymology: "Du grec aroma, parfum", organ: "Corps entier", specialty: "Aromathérapie", category: "pharmacologie"},
  {term: "Gemmothérapie", definition: "Traitement par les bourgeons", etymology: "Du latin gemma, bourgeon", organ: "Corps entier", specialty: "Gemmothérapie", category: "pharmacologie"},
  {term: "Oligothérapie", definition: "Traitement par les oligo-éléments", etymology: "Du grec oligos, peu", organ: "Corps entier", specialty: "Oligothérapie", category: "pharmacologie"},
  {term: "Naturopathie", definition: "Médecine naturelle", etymology: "Du latin natura, nature", organ: "Corps entier", specialty: "Naturopathie", category: "médecine alternative"},
  {term: "Hydrothérapie", definition: "Traitement par l'eau", etymology: "Du grec hydor, eau", organ: "Corps entier", specialty: "Hydrothérapie", category: "médecine alternative"},
  {term: "Thalassothérapie", definition: "Traitement par l'eau de mer", etymology: "Du grec thalassa, mer", organ: "Corps entier", specialty: "Thalassothérapie", category: "médecine alternative"},
  {term: "Climatothérapie", definition: "Traitement par le climat", etymology: "Du grec klima, climat", organ: "Corps entier", specialty: "Climatothérapie", category: "médecine alternative"},
  {term: "Héliothérapie", definition: "Traitement par le soleil", etymology: "Du grec helios, soleil", organ: "Peau", specialty: "Héliothérapie", category: "médecine alternative"},
  {term: "Balnéothérapie", definition: "Traitement par les bains", etymology: "Du latin balneum, bain", organ: "Corps entier", specialty: "Balnéothérapie", category: "médecine alternative"},
  {term: "Cryothérapie", definition: "Traitement par le froid", etymology: "Du grec kryos, froid", organ: "Corps entier", specialty: "Cryothérapie", category: "médecine générale"},
  {term: "Thermothérapie", definition: "Traitement par la chaleur", etymology: "Du grec thermos, chaud", organ: "Corps entier", specialty: "Thermothérapie", category: "médecine générale"},
  {term: "Laserthérapie", definition: "Traitement par laser", etymology: "De laser", organ: "Peau", specialty: "Laserthérapie", category: "médecine générale"},
  {term: "Magnétothérapie", definition: "Traitement par les aimants", etymology: "Du grec magnes, aimant", organ: "Corps entier", specialty: "Magnétothérapie", category: "médecine alternative"},
  {term: "Électrothérapie", definition: "Traitement par l'électricité", etymology: "Du grec elektron, ambre", organ: "Corps entier", specialty: "Électrothérapie", category: "médecine générale"},
  {term: "Radiothérapie", definition: "Traitement par les rayons", etymology: "Du latin radius, rayon", organ: "Tumeurs", specialty: "Radiothérapie", category: "oncologie"},
  {term: "Chimiothérapie", definition: "Traitement par les médicaments", etymology: "Du grec chemeia", organ: "Corps entier", specialty: "Chimiothérapie", category: "oncologie"},
  {term: "Immunothérapie", definition: "Traitement par le système immunitaire", etymology: "Du latin immunis", organ: "Système immunitaire", specialty: "Immunothérapie", category: "oncologie"},
  {term: "Hormonothérapie", definition: "Traitement par les hormones", etymology: "Du grec hormôn", organ: "Glandes", specialty: "Hormonothérapie", category: "endocrinologie"},
  {term: "Génétique", definition: "Étude des gènes", etymology: "Du grec genesis", organ: "Cellules", specialty: "Génétique", category: "biochimie"},
  {term: "Génomique", definition: "Étude des génomes", etymology: "Du grec genos, race", organ: "Cellules", specialty: "Génomique", category: "biochimie"},
  {term: "Protéomique", definition: "Étude des protéines", etymology: "Du grec proteios, premier", organ: "Cellules", specialty: "Protéomique", category: "biochimie"},
  {term: "Métabolomique", definition: "Étude du métabolisme", etymology: "Du grec metabole, changement", organ: "Cellules", specialty: "Métabolomique", category: "biochimie"},
  {term: "Transgénique", definition: "Organisme modifié génétiquement", etymology: "Du latin trans, à travers", organ: "Organismes", specialty: "Génétique", category: "biochimie"},
  {term: "Clonage", definition: "Reproduction génétique identique", etymology: "Du grec klon, branche", organ: "Organismes", specialty: "Génétique", category: "biochimie"},
  {term: "Thérapie génique", definition: "Traitement par modification génétique", etymology: "Du greek genea", organ: "Cellules", specialty: "Génétique", category: "biochimie"},
  {term: "Cellules souches", definition: "Cellules indifférenciées", etymology: "Du latin cellula", organ: "Cellules", specialty: "Biologie cellulaire", category: "biochimie"},
  {term: "Bioéthique", definition: "Éthique des sciences de la vie", etymology: "Du grec bios, vie", organ: "Société", specialty: "Bioéthique", category: "médecine générale"},
  {term: "Télémédecine", definition: "Médecine à distance", etymology: "Du grec tele, loin", organ: "Corps entier", specialty: "Télémédecine", category: "médecine générale"},
  {term: "E-santé", definition: "Santé numérique", etymology: "De électronique", organ: "Société", specialty: "E-santé", category: "médecine générale"},
  {term: "Big data médical", definition: "Données massives en santé", etymology: "De l'anglais", organ: "Société", specialty: "Informatique médicale", category: "médecine générale"},
  {term: "Intelligence artificielle médicale", definition: "IA en médecine", etymology: "De l'anglais", organ: "Société", specialty: "Informatique médicale", category: "médecine générale"}
];

// Préfixes médicaux
const prefixes = [
  "cardio", "neuro", "gastro", "hémo", "dermato", "ostéo", "arthro", "myo", "néphro", "pneumo",
  "endo", "exo", "hyper", "hypo", "dys", "a", "an", "anti", "auto", "bio",
  "brady", "tachy", "micro", "macro", "méga", "nano", "kilo", "milli", "centi", "déci",
  "pan", "poly", "mono", "multi", "hétéro", "homo", "iso", "auto", "allo", "xéno",
  "para", "peri", "endo", "epi", "hypo", "hyper", "méta", "méso", "télé", "cata",
  "syn", "dys", "mal", "pseudo", "quasi", "semi", "hemi", "demi", "sub", "supra",
  "infra", "inter", "intra", "extra", "ultra", "super", "supra", "trans", "cis", "retro",
  "ante", "post", "pre", "pro", "anti", "contra", "ob", "sub", "super", "sur"
];

// Racines médicales
const roots = [
  "cœur", "cerveau", "estomac", "sang", "peau", "os", "articulation", "muscle", "rein", "poumon",
  "glande", "foie", "rate", "pancréas", "intestin", "côlon", "rectum", "vésicule", "vessie", "urètre",
  "nerf", "neurone", "synapse", "axone", "dendrite", "myéline", "glia", "ganglion", "plexus", "moelle",
  "artère", "veine", "capillaire", "lymphe", "nœud", "vaisseau", "cœur", "aorte", "carotide", "fémorale",
  "œil", "oreille", "nez", "bouche", "langue", "dent", "gencive", "lèvre", "palais", "pharynx",
  "larynx", "trachée", "bronche", "alvéole", "plèvre", "diaphragme", "côtes", "sternum", "clavicule", "omoplate",
  "humérus", "radius", "cubitus", "carpe", "métacarpe", "phalange", "fémur", "tibia", "péroné", "tarse",
  "métatarse", "colonne", "vertèbre", "disque", "sacrum", "coccyx", "pelvis", "bassin", "hanche", "genou",
  "cheville", "pied", "orteil", "main", "doigt", "poignet", "coude", "épaule", "nuque", "tête",
  "visage", "front", "tempes", "joues", "menton", "barbe", "cheveux", "cils", "sourcils", "paupière"
];

// Suffixes médicaux
const suffixes = [
  "logie", "ite", "pathie", "ectomie", "tomie", "graphie", "scopie", "thérapie", "praxie", "graphie",
  "mie", "genèse", "plasie", "trophy", "stase", "rrhée", "pnée", "cardie", "algie", "dynie",
  "phobie", "manie", "schizie", "phrénie", "logie", "sophie", "gnose", "mancie", "thymie", "tonie",
  "taxie", "kinesie", "lepsie", "plegie", "parésie", "asthénie", "myasthénie", "dystrophie", "atrophie", "hypertrophie",
  "plasie", "genèse", "morphie", "metrie", "podie", "graphie", "scopie", "scope", "meter", "gramme",
  "stome", "tome", "ectomie", "plastie", "rraphie", "pexie", "suspension", "fixation", "stabilisation", "immobilisation",
  "thérapie", "traitement", "cure", "soin", "guérison", "récupération", "réhabilitation", "rééducation", "prévention", "prophylaxie",
  "diagnostic", "pronostic", "thérapeutique", "clinique", "pathologique", "physiologique", "anatomique", "histologique", "cytologique", "moléculaire",
  "génétique", "héréditaire", "congénital", "acquis", "idiopathique", "iatrogène", "nosocomial", "endémique", "épidémique", "pandémique",
  "aigu", "chronique", "subaigu", "bénin", "malin", "grave", "critique", "terminal", "fatal", "létal"
];

// Catégories
const categories = ["anatomie", "physiologie", "pathologie", "pharmacologie", "biochimie", "microbiologie", "neurologie", "cardiologie", "histologie", "embryologie"];

// Spécialités
const specialties = [
  "Médecine générale", "Cardiologie", "Neurologie", "Pneumologie", "Gastroentérologie", "Néphrologie",
  "Endocrinologie", "Hématologie", "Oncologie", "Rhumatologie", "Dermatologie", "Ophtalmologie",
  "ORL", "Psychiatrie", "Pédiatrie", "Gériatrie", "Obstétrique", "Gynécologie", "Urologie",
  "Chirurgie", "Anesthésiologie", "Radiologie", "Médecine légale", "Santé publique", "Épidémiologie",
  "Pharmacologie", "Toxicologie", "Microbiologie", "Virologie", "Bactériologie", "Parasitologie",
  "Mycologie", "Immunologie", "Génétique", "Biochimie", "Biologie moléculaire", "Histologie",
  "Cytologie", "Embryologie", "Anatomopathologie", "Médecine nucléaire", "Médecine d'urgence", "Réanimation"
];

// Templates de définitions riches basés sur les suffixes
const definitionTemplates = {
  "logie": (prefix, root) => `Discipline médicale et scientifique dédiée à l'étude approfondie de ${root}, englobant l'analyse de sa structure, de son fonctionnement physiologique, de ses pathologies associées ainsi que les méthodes diagnostiques et thérapeutiques spécifiques. Cette spécialité requiert une expertise approfondie en ${prefix}logie pour une prise en charge optimale des patients.`,
  "ite": (prefix, root) => `Affection inflammatoire aiguë ou chronique touchant ${root}, caractérisée par une réaction immunitaire locale avec infiltration de cellules inflammatoires, œdème, rougeur et douleur. Les manifestations cliniques incluent typiquement ${prefix}ite avec symptômes variables selon la localisation, souvent causée par des agents infectieux (bactéries, virus, champignons) ou des processus auto-immuns.`,
  "pathie": (prefix, root) => `État pathologique ou maladie affectant ${root}, se manifestant par des altérations fonctionnelles et structurelles caractéristiques. Cette affection peut être d'origine congénitale, acquise, idiopathique ou iatrogène, nécessitant une prise en charge spécialisée en ${prefix}pathie. Le pronostic dépend de la précocité du diagnostic et de l'adéquation du traitement.`,
  "ectomie": (prefix, root) => `Intervention chirurgicale consistant en l'ablation ou l'exérèse de ${root}, réalisée selon des protocoles opératoires stricts sous anesthésie générale ou locorégionale. Cette procédure est indiquée dans des conditions pathologiques spécifiques nécessitant une ${prefix}ectomie, avec des suites opératoires variables selon la complexité de l'intervention.`,
  "tomie": (prefix, root) => `Acte chirurgical d'ouverture ou d'incision de ${root}, permettant l'accès direct aux structures internes pour des fins diagnostiques ou thérapeutiques. Cette technique opératoire requiert une maîtrise précise de l'anatomie ${prefix}tomique et peut être associée à d'autres gestes chirurgicaux selon le contexte clinique.`,
  "graphie": (prefix, root) => `Technique d'imagerie médicale et de diagnostic par visualisation de ${root}, utilisant divers procédés physiques (rayons X, ultrasons, résonance magnétique, radio-isotopes). La ${prefix}graphie permet d'obtenir des images détaillées des structures internes, facilitant le diagnostic des pathologies et le suivi thérapeutique.`,
  "scopie": (prefix, root) => `Méthode d'exploration endoscopique permettant l'examen visuel direct de ${root} à l'aide d'un instrument optique flexible. La ${prefix}scopie est essentielle pour le diagnostic, la surveillance et parfois le traitement de lésions localisées, avec des indications précises selon les contextes cliniques.`,
  "thérapie": (prefix, root) => `Approche thérapeutique ciblant ${root}, utilisant des modalités spécifiques de traitement médical, chirurgical ou physique. La ${prefix}thérapie vise à restaurer ou améliorer la fonction physiologique, soulager les symptômes, et prévenir les complications, selon des protocoles validés par la recherche clinique.`,
  "praxie": (prefix, root) => `Technique thérapeutique ou procédure médicale appliquée à ${root}, nécessitant une expertise spécialisée et une formation approfondie. La ${prefix}praxie combine des connaissances théoriques et des compétences pratiques pour optimiser les résultats cliniques et minimiser les risques.`,
  "mie": (prefix, root) => `Affection caractérisée par une altération pathologique de ${root}, souvent d'origine dégénérative, inflammatoire ou néoplasique. La ${prefix}mie présente des manifestations cliniques spécifiques et peut évoluer vers des complications sévères sans prise en charge adaptée.`,
  "genèse": (prefix, root) => `Processus de formation, de développement ou d'origine de ${root}, étudié dans le contexte de la physiologie normale ou pathologique. La ${prefix}genèse comprend les mécanismes moléculaires, cellulaires et tissulaires régissant l'apparition et l'évolution des structures biologiques.`,
  "plasie": (prefix, root) => `Processus de développement, de croissance ou de formation de ${root}, pouvant être physiologique (normal) ou pathologique (anormal). La ${prefix}plasie implique des mécanismes cellulaires complexes de prolifération, différenciation et maturation, régulés par des facteurs de croissance et des signaux moléculaires.`,
  "stase": (prefix, root) => `Arrêt ou ralentissement anormal du flux ou du mouvement de ${root}, entraînant des conséquences physiologiques et pathologiques. La ${prefix}stase peut être d'origine fonctionnelle, mécanique ou obstructive, nécessitant une étiologie précise pour un traitement approprié.`,
  "rrhée": (prefix, root) => `Écoulement anormal ou excessif de ${root}, souvent lié à une pathologie sous-jacente ou à une perturbation physiologique. La ${prefix}rrhée se manifeste par des sécrétions ou pertes caractéristiques, dont l'analyse clinique et paraclinique oriente le diagnostic étiologique.`,
  "pnée": (prefix, root) => `Trouble de la respiration affectant ${root}, caractérisé par des anomalies du rythme, de l'amplitude ou de la qualité des mouvements respiratoires. La ${prefix}pnée peut être d'origine centrale, périphérique ou mixte, nécessitant une évaluation précise des fonctions respiratoires.`,
  "cardie": (prefix, root) => `Affection cardiaque ou trouble du rythme cardiaque affectant ${root}, avec des conséquences hémodynamiques potentiellement sévères. La ${prefix}cardie nécessite une surveillance cardiologique rigoureuse et un traitement adapté selon le type et la sévérité du trouble.`,
  "algie": (prefix, root) => `Douleur ou sensation douloureuse localisée au niveau de ${root}, pouvant être aiguë ou chronique, d'intensité variable. La ${prefix}algie nécessite une évaluation précise de ses caractéristiques (siège, intensité, type, irradiation) pour orienter le diagnostic étiologique et le traitement antalgique.`,
  "dynie": (prefix, root) => `Douleur intense ou souffrance caractéristique affectant ${root}, souvent associée à des processus inflammatoires ou lésionnels sévères. La ${prefix}dynie impose une prise en charge urgente avec évaluation diagnostique rapide et traitement analgique adapté.`,
  "phobie": (prefix, root) => `Trouble anxieux caractérisé par une peur irrationnelle et intense de ${root}, entraînant des comportements d'évitement significatifs. La ${prefix}phobie peut être spécifique ou généralisée, nécessitant une approche psychothérapeutique spécialisée (thérapie cognitivo-comportementale, exposition graduée).`,
  "manie": (prefix, root) => `État pathologique caractérisé par une excitation ou une hyperactivité anormale de ${root}, souvent associé à des troubles de l'humeur ou du comportement. La ${prefix}manie peut être d'origine psychiatrique, neurologique ou métabolique, nécessitant une évaluation spécialisée.`,
  "schizie": (prefix, root) => `Dissociation ou fragmentation pathologique de ${root}, caractéristique de certains troubles psychiatriques sévères. La ${prefix}schizie implique une désorganisation des fonctions cognitives et émotionnelles, nécessitant une prise en charge psychiatrique spécialisée.`,
  "phrénie": (prefix, root) => `Trouble de l'esprit ou de la pensée affectant ${root}, se manifestant par des altérations cognitives, émotionnelles ou comportementales. La ${prefix}phrénie peut être d'origine organique, fonctionnelle ou mixte, avec des implications diagnostiques et thérapeutiques spécifiques.`,
  "sophie": (prefix, root) => `Connaissance ou sagesse spécialisée concernant ${root}, acquise par l'étude et l'expérience. La ${prefix}sophie représente un corpus de connaissances approfondies dans un domaine médical ou scientifique spécifique.`,
  "gnose": (prefix, root) => `Connaissance ou reconnaissance de ${root}, basée sur l'observation clinique, l'expérience ou l'analyse scientifique. La ${prefix}gnose est essentielle pour le diagnostic médical et la compréhension des processus pathologiques.`,
  "mancie": (prefix, root) => `Trouble caractérisé par une perte ou une altération de la fonction de ${root}, souvent d'origine neurologique ou psychiatrique. La ${prefix}mancie nécessite une évaluation approfondie pour déterminer l'étiologie et orienter le traitement.`,
  "thymie": (prefix, root) => `État affectif ou émotionnel lié à ${root}, pouvant être normal (euthymie), déprimé (dysthymie) ou exalté (hyperthymie). La ${prefix}thymie est un élément clé de l'évaluation psychiatrique et du suivi thérapeutique.`,
  "tonie": (prefix, root) => `État de tension ou de tonus de ${root}, essentiel pour son fonctionnement physiologique normal. La ${prefix}tonie peut être augmentée (hypertonie), diminuée (hypotonie) ou absente (atonie), avec des implications cliniques spécifiques.`,
  "taxie": (prefix, root) => `Mouvement ou déplacement anormal de ${root}, souvent d'origine neurologique ou musculaire. La ${prefix}taxie peut être spontanée, provoquée ou réflexe, nécessitant une évaluation pour déterminer sa nature et son étiologie.`,
  "kinesie": (prefix, root) => `Mouvement ou activité motrice de ${root}, pouvant être normale, augmentée (hyperkinésie) ou diminuée (hypokinésie). La ${prefix}kinesie est un paramètre essentiel de l'examen neurologique et musculosquelettique.`,
  "lepsie": (prefix, root) => `Trouble convulsif ou paroxystique affectant ${root}, caractérisé par des crises répétées d'origine épileptique. La ${prefix}lepsie nécessite une évaluation électrophysiologique et un traitement antiépileptique adapté.`,
  "plegie": (prefix, root) => `Paralysie complète ou perte de mouvement de ${root}, d'origine centrale ou périphérique. La ${prefix}plegie peut être flasque ou spastique, selon la localisation et la nature de la lésion neurologique.`,
  "parésie": (prefix, root) => `Faiblesse ou diminution de la force motrice de ${root}, pouvant être partielle ou complète. La ${prefix}parésie nécessite une évaluation neurologique précise pour déterminer l'étiologie et le pronostic fonctionnel.`,
  "asthénie": (prefix, root) => `Fatigue intense ou faiblesse généralisée affectant ${root}, souvent associée à des pathologies systémiques ou à des troubles métaboliques. La ${prefix}asthénie nécessite une évaluation complète pour identifier les causes sous-jacentes.`,
  "myasthénie": (prefix, root) => `Faiblesse musculaire pathologique affectant ${root}, d'origine auto-immune ou génétique. La ${prefix}myasthénie se caractérise par une fatigabilité musculaire accrue à l'effort, nécessitant un traitement immunomodulateur.`,
  "dystrophie": (prefix, root) => `Affection dégénérative de ${root}, caractérisée par une atrophie progressive et des altérations structurelles. La ${prefix}dystrophie peut être d'origine génétique, métabolique ou acquise, avec un pronostic variable selon le type.`,
  "atrophie": (prefix, root) => `Diminution de volume ou de taille de ${root}, due à une dégénérescence, un manque d'utilisation ou une pathologie sous-jacente. L'${prefix}atrophie peut être réversible ou irréversible selon la cause et la durée d'évolution.`,
  "hypertrophie": (prefix, root) => `Augmentation de volume ou de taille de ${root}, secondaire à une hyperactivité, une stimulation chronique ou une pathologie. L'${prefix}hypertrophie peut être physiologique (adaptative) ou pathologique, nécessitant une étiologie précise.`,
  "morphie": (prefix, root) => `Altération de la forme ou de la structure de ${root}, pouvant être congénitale ou acquise. La ${prefix}morphie peut être isolée ou associée à d'autres anomalies, nécessitant une évaluation morphologique précise.`,
  "metrie": (prefix, root) => `Mesure ou évaluation quantitative de ${root}, utilisée pour le diagnostic et le suivi des pathologies. La ${prefix}metrie est essentielle en médecine pour objectiver les variations physiologiques ou pathologiques.`,
  "podie": (prefix, root) => `Affection ou trouble affectant le pied ou la marche, avec implications pour ${root}. La ${prefix}podie nécessite une évaluation podologique et orthopédique pour optimiser la fonction locomotrice.`,
  "stome": (prefix, root) => `Ouverture artificielle ou communication chirurgicale créée au niveau de ${root}, permettant l'accès ou l'évacuation de substances. La ${prefix}stome nécessite des soins spécifiques et une surveillance pour prévenir les complications.`,
  "tome": (prefix, root) => `Section ou coupure chirurgicale de ${root}, réalisée selon des protocoles précis. La ${prefix}tome est une technique opératoire nécessitant une expertise chirurgicale approfondie.`,
  "plastie": (prefix, root) => `Reconstruction chirurgicale ou plastique de ${root}, utilisant des techniques de greffe, de suture ou de remodelage. La ${prefix}plastie vise à restaurer la fonction et l'esthétique des structures affectées.`,
  "rraphie": (prefix, root) => `Suture chirurgicale ou rapprochement des bords de ${root}, réalisée selon des techniques spécifiques. La ${prefix}rraphie est essentielle pour la cicatrisation et la restauration de l'intégrité tissulaire.`,
  "pexie": (prefix, root) => `Fixation chirurgicale ou suspension de ${root} dans une position anatomique normale. La ${prefix}pexie est indiquée dans les cas de ptose ou de déplacement pathologique des structures.`,
  "default": (prefix, root) => `Terme médical relatif à ${root}, dans le contexte de ${prefix}. Cette condition nécessite une évaluation clinique approfondie pour déterminer sa nature exacte et orienter la prise en charge thérapeutique appropriée.`
};

// Fonction de génération procédurale avec définitions riches
function generateProceduralTerms(count) {
  const terms = [];
  const usedTerms = new Set(realMedicalTerms.map(t => t.term.toLowerCase()));
  
  for (let i = 0; i < count; i++) {
    let term;
    let attempts = 0;
    
    do {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const root = roots[Math.floor(Math.random() * roots.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      
      // Variations de combinaison
      const pattern = Math.floor(Math.random() * 4);
      switch(pattern) {
        case 0: term = prefix + root + suffix; break;
        case 1: term = prefix + suffix; break;
        case 2: term = root + suffix; break;
        case 3: term = prefix + root; break;
      }
      
      // Capitaliser première lettre
      term = term.charAt(0).toUpperCase() + term.slice(1);
      attempts++;
    } while (usedTerms.has(term.toLowerCase()) && attempts < 10);
    
    if (attempts >= 10) continue;
    
    usedTerms.add(term.toLowerCase());
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const specialty = specialties[Math.floor(Math.random() * specialties.length)];
    const organ = roots[Math.floor(Math.random() * roots.length)];
    
    // Extraire le suffixe pour la génération de définition
    let usedSuffix = "";
    for (const s of suffixes) {
      if (term.toLowerCase().endsWith(s)) {
        usedSuffix = s;
        break;
      }
    }
    
    // Extraire le préfixe pour la génération de définition
    let usedPrefix = "";
    for (const p of prefixes) {
      if (term.toLowerCase().startsWith(p.toLowerCase())) {
        usedPrefix = p;
        break;
      }
    }
    
    // Générer définition riche basée sur le suffixe
    const template = definitionTemplates[usedSuffix] || definitionTemplates.default;
    const definition = template(usedPrefix, organ);
    
    // Générer étymologie détaillée
    const etymology = `Terme médical composé du préfixe "${usedPrefix || 'élément grec'}" et du suffixe "${usedSuffix || 'élément latin'}", dérivé de l'étude ${category} en ${specialty}.`;
    
    terms.push({
      id: (realMedicalTerms.length + i + 1).toString(),
      term,
      definition,
      etymology,
      organ: organ.charAt(0).toUpperCase() + organ.slice(1),
      specialty,
      category
    });
  }
  
  return terms;
}

// Fonction pour obtenir tous les termes (lazy loading)
let cachedTerms = null;

export function getMedicalTerms() {
  if (cachedTerms) return cachedTerms;
  
  // Combiner termes réels et générés
  const proceduralTerms = generateProceduralTerms(14900); // 15000 - 100 réels
  
  cachedTerms = [
    ...realMedicalTerms.map((t, i) => ({...t, id: (i + 1).toString()})),
    ...proceduralTerms
  ];
  
  return cachedTerms;
}

// Export direct pour compatibilité
export const mockMedicalTerms = getMedicalTerms();
