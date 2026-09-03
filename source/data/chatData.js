// Données initiales pour VicLov Chat
export const chatData = {
  // Discussions privées et groupes
  conversations: [
    {
      id: "1",
      name: "Dr. Sophie Martin",
      avatar: "SM",
      avatarColor: "from-[#005F73] to-[#0A9396]",
      type: "private",
      lastMessage: "Les résultats du laboratoire sont disponibles",
      lastMessageTime: "10:30",
      unreadCount: 2,
      online: true,
      pinned: false,
      messages: [
        { id: "m1", sender: "other", text: "Bonjour, avez-vous reçu les résultats ?", time: "10:25", pinned: false },
        { id: "m2", sender: "me", text: "Oui, je les ai reçus ce matin", time: "10:28", pinned: false },
        { id: "m3", sender: "other", text: "Les résultats du laboratoire sont disponibles", time: "10:30", pinned: false }
      ]
    },
    {
      id: "2",
      name: "Groupe Étude Cardiologie",
      avatar: "EC",
      avatarColor: "from-[#005F73] to-[#0A9396]",
      type: "group",
      lastMessage: "Marie: J'ai partagé les notes de cours",
      lastMessageTime: "09:45",
      unreadCount: 5,
      online: false,
      pinned: true,
      messages: [
        { id: "m4", sender: "other", text: "Qui a les notes de cardiologie ?", time: "09:30", pinned: true },
        { id: "m5", sender: "other", text: "Je peux les partager", time: "09:35", pinned: false },
        { id: "m6", sender: "me", text: "Merci beaucoup !", time: "09:40", pinned: false },
        { id: "m7", sender: "other", text: "Marie: J'ai partagé les notes de cours", time: "09:45", pinned: false }
      ]
    },
    {
      id: "3",
      name: "Prof. Pierre Leroy",
      avatar: "PL",
      avatarColor: "from-[#005F73] to-[#0A9396]",
      type: "private",
      lastMessage: "N'oubliez pas le TP de demain",
      lastMessageTime: "Hier",
      unreadCount: 0,
      online: false,
      pinned: false,
      messages: [
        { id: "m8", sender: "other", text: "Bonjour les étudiants", time: "Hier 14:00", pinned: false },
        { id: "m9", sender: "other", text: "N'oubliez pas le TP de demain", time: "Hier 14:05", pinned: false }
      ]
    },
    {
      id: "4",
      name: "Groupe Révision Pharmacologie",
      avatar: "RP",
      avatarColor: "from-[#005F73] to-[#0A9396]",
      type: "group",
      lastMessage: "Lucas: Quiz terminé, score 18/20",
      lastMessageTime: "Hier",
      unreadCount: 0,
      online: false,
      pinned: false,
      messages: [
        { id: "m10", sender: "other", text: "Qui a fait le quiz ?", time: "Hier 16:00", pinned: false },
        { id: "m11", sender: "other", text: "Lucas: Quiz terminé, score 18/20", time: "Hier 16:15", pinned: false }
      ]
    },
    {
      id: "5",
      name: "Emma Rousseau",
      avatar: "ER",
      avatarColor: "from-[#005F73] to-[#0A9396]",
      type: "private",
      lastMessage: "Merci pour l'aide en anatomie !",
      lastMessageTime: "Lundi",
      unreadCount: 0,
      online: true,
      pinned: false,
      messages: [
        { id: "m12", sender: "other", text: "Peux-tu m'aider en anatomie ?", time: "Lundi 10:00", pinned: false },
        { id: "m13", sender: "me", text: "Bien sûr, quel sujet ?", time: "Lundi 10:05", pinned: false },
        { id: "m14", sender: "other", text: "Merci pour l'aide en anatomie !", time: "Lundi 10:30", pinned: false }
      ]
    }
  ],

  // Stories (Statuts)
  stories: [
    {
      id: "s1",
      name: "Dr. Sophie Martin",
      avatar: "SM",
      avatarColor: "from-[#005F73] to-[#0A9396]",
      time: "Il y a 2h",
      viewed: false,
      content: "Nouvelle publication sur les avancées en cardiologie ! 📚",
      image: null
    },
    {
      id: "s2",
      name: "Marie Dupont",
      avatar: "MD",
      avatarColor: "from-[#005F73] to-[#0A9396]",
      time: "Il y a 4h",
      viewed: true,
      content: "Révision terminée pour l'examen de demain ! 🎉",
      image: null
    },
    {
      id: "s3",
      name: "Pierre Leroy",
      avatar: "PL",
      avatarColor: "from-[#005F73] to-[#0A9396]",
      time: "Il y a 6h",
      viewed: false,
      content: "Journée productive au laboratoire 🔬",
      image: null
    },
    {
      id: "s4",
      name: "Lucas Petit",
      avatar: "LP",
      avatarColor: "from-[#005F73] to-[#0A9396]",
      time: "Il y a 8h",
      viewed: true,
      content: "Nouveau quiz disponible sur VicLov !",
      image: null
    },
    {
      id: "s5",
      name: "Emma Rousseau",
      avatar: "ER",
      avatarColor: "from-[#005F73] to-[#0A9396]",
      time: "Il y a 12h",
      viewed: false,
      content: "Étude de cas intéressante en pathologie 📖",
      image: null
    }
  ]
};

export default chatData;
