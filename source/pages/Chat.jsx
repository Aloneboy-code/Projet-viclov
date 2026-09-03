import { useState, useEffect } from "react";
import { MessageCircle, Plus, Search, MoreVertical, Pin, Trash2, Send, ArrowLeft, X, Users } from "lucide-react";
import chatData from "@/data/chatData";

export default function Chat() {
  const [conversations, setConversations] = useState(chatData.conversations);
  const [stories, setStories] = useState(chatData.stories);
  const [activeConversation, setActiveConversation] = useState(null);
  const [activeTab, setActiveTab] = useState("discussions");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  // Story progression
  useEffect(() => {
    if (showStoryModal && activeStory) {
      const timer = setTimeout(() => {
        setShowStoryModal(false);
        setActiveStory(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showStoryModal, activeStory]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message = {
      id: `m${Date.now()}`,
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      pinned: false
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: newMessage,
          lastMessageTime: message.time
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setActiveConversation(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: newMessage,
      lastMessageTime: message.time
    }));
    setNewMessage("");
  };

  const handlePinMessage = (messageId) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation.id) {
        return {
          ...conv,
          messages: conv.messages.map(msg => 
            msg.id === messageId ? { ...msg, pinned: !msg.pinned } : msg
          )
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setActiveConversation(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId ? { ...msg, pinned: !msg.pinned } : msg
      )
    }));
  };

  const handleDeleteMessage = (messageId) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation.id) {
        return {
          ...conv,
          messages: conv.messages.filter(msg => msg.id !== messageId)
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setActiveConversation(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => msg.id !== messageId)
    }));
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup = {
      id: `g${Date.now()}`,
      name: newGroupName,
      avatar: newGroupName.substring(0, 2).toUpperCase(),
      avatarColor: "from-[#005F73] to-[#0A9396]",
      type: "group",
      lastMessage: "Groupe créé",
      lastMessageTime: "Maintenant",
      unreadCount: 0,
      online: false,
      pinned: false,
      messages: [
        {
          id: `m${Date.now()}`,
          sender: "me",
          text: `Groupe "${newGroupName}" créé`,
          time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          pinned: false
        }
      ]
    };

    setConversations([newGroup, ...conversations]);
    setNewGroupName("");
    setShowCreateGroupModal(false);
  };

  const handleStoryClick = (story) => {
    setActiveStory(story);
    setShowStoryModal(true);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedMessages = activeConversation?.messages.filter(msg => msg.pinned) || [];
  const regularMessages = activeConversation?.messages.filter(msg => !msg.pinned) || [];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Liste des conversations */}
      <div className={`w-full md:w-96 bg-card border-r border-border flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#005F73] to-[#0A9396] px-4 py-4 flex items-center justify-between">
          <h1 className="text-white font-bold text-xl">VicLov Chat</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
              title="Créer un groupe"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("discussions")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "discussions"
                ? "text-[#005F73] border-b-2 border-[#005F73] bg-[#F8F9FA] dark:bg-[#0F172A]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Discussions
          </button>
          <button
            onClick={() => setActiveTab("stories")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "stories"
                ? "text-[#005F73] border-b-2 border-[#005F73] bg-[#F8F9FA] dark:bg-[#0F172A]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Stories
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005F73]/30"
            />
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === "discussions" ? (
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted transition-colors ${
                  activeConversation?.id === conv.id ? "bg-[#F8F9FA] dark:bg-[#0F172A]/50" : ""
                }`}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${conv.avatarColor} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{conv.avatar}</span>
                  </div>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground truncate">{conv.name}</span>
                    <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground truncate">{conv.lastMessage}</span>
                    {conv.unreadCount > 0 && (
                      <span className="bg-[#005F73] text-white text-xs rounded-full px-2 py-0.5">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-3 gap-4 p-4">
              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => handleStoryClick(story)}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${story.avatarColor} p-0.5 ${!story.viewed ? 'ring-2 ring-[#0A9396]' : ''}`}>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#005F73] to-[#0A9396] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{story.avatar}</span>
                    </div>
                  </div>
                  <span className="text-xs text-foreground text-center">{story.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zone de conversation active */}
      {activeConversation ? (
        <div className={`flex-1 flex flex-col ${activeConversation ? 'flex' : 'hidden md:flex'}`}>
          {/* Header de la conversation */}
          <div className="bg-gradient-to-r from-[#005F73] to-[#0A9396] px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setActiveConversation(null)}
              className="md:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${activeConversation.avatarColor} flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">{activeConversation.avatar}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-white font-semibold">{activeConversation.name}</h2>
              <p className="text-white/70 text-xs">{activeConversation.online ? "En ligne" : "Hors ligne"}</p>
            </div>
            <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
            {/* Messages épinglés */}
            {pinnedMessages.length > 0 && (
              <div className="mb-4 space-y-2">
                {pinnedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-[#EE9B00]/10 dark:bg-[#EE9B00]/20 border border-[#EE9B00] rounded-lg p-3 relative"
                  >
                    <div className="flex items-start gap-2">
                      <Pin className="w-4 h-4 text-[#EE9B00] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{msg.text}</p>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <button
                        onClick={() => handlePinMessage(msg.id)}
                        className="p-1 hover:bg-[#EE9B00]/20 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-[#EE9B00]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Messages réguliers */}
            <div className="space-y-3">
              {regularMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 relative ${
                      msg.sender === "me"
                        ? "bg-gradient-to-r from-[#005F73] to-[#0A9396] text-white"
                        : "bg-card border border-border text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs ${msg.sender === "me" ? "text-white/70" : "text-muted-foreground"}`}>{msg.time}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handlePinMessage(msg.id)}
                          className="p-1 hover:bg-white/20 dark:hover:bg-white/10 rounded transition-colors"
                          title={msg.pinned ? "Désépingler" : "Épingler"}
                        >
                          <Pin className={`w-3 h-3 ${msg.pinned ? "text-amber-300" : (msg.sender === "me" ? "text-white/70" : "text-muted-foreground")}`} />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1 hover:bg-white/20 dark:hover:bg-white/10 rounded transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className={`w-3 h-3 ${msg.sender === "me" ? "text-white/70" : "text-muted-foreground"}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone de saisie */}
          <div className="bg-card border-t border-border p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Écrivez un message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005F73]/30"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-gradient-to-r from-[#005F73] to-[#0A9396] text-white rounded-lg hover:from-[#005F73]/90 hover:to-[#0A9396]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* État vide */
        <div className="hidden md:flex flex-1 items-center justify-center bg-muted/30">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#005F73] to-[#0A9396] flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">VicLov Chat</h2>
            <p className="text-muted-foreground">Sélectionnez une conversation pour commencer</p>
          </div>
        </div>
      )}

      {/* Modal Story */}
      {showStoryModal && activeStory && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowStoryModal(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="w-full max-w-md h-full max-h-[80vh] bg-gradient-to-br from-[#005F73] to-[#0A9396] rounded-2xl p-6 flex flex-col items-center justify-center relative">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${activeStory.avatarColor} flex items-center justify-center mb-4`}>
              <span className="text-white font-bold text-2xl">{activeStory.avatar}</span>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">{activeStory.name}</h3>
            <p className="text-white/90 text-center text-lg mb-4">{activeStory.content}</p>
            <span className="text-white/70 text-sm">{activeStory.time}</span>
            
            {/* Progression */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
              <div className="h-full bg-white transition-all duration-[5000ms] ease-linear" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      )}

      {/* Modal Création de groupe */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Créer un groupe</h3>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="p-2 rounded-lg hover:bg-muted transition-all"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#005F73] to-[#0A9396] flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <input
                type="text"
                placeholder="Nom du groupe"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005F73]/30"
              />
            </div>
            <button
              onClick={handleCreateGroup}
              disabled={!newGroupName.trim()}
              className="w-full py-2 bg-gradient-to-r from-[#005F73] to-[#0A9396] text-white rounded-lg hover:from-[#005F73]/90 hover:to-[#0A9396]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer le groupe
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
