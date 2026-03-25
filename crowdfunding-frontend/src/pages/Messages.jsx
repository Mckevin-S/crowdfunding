import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getRecentConversations, 
  getConversation, 
  sendMessage, 
  markAsRead 
} from '../store/slices/messageSlice';
import { Search, Send, User, ChevronLeft, MoreVertical, Loader2 } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { 
    conversations, 
    currentConversation, 
    isLoading, 
    isSending 
  } = useSelector(state => state.messages);

  const [activePartner, setActivePartner] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Charger les conversations récentes
  useEffect(() => {
    if (user) {
      dispatch(getRecentConversations(user.id));
    }
  }, [dispatch, user]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [currentConversation]);

  const handleSelectConversation = (conv) => {
    const partnerId = conv.expediteurId === user.id ? conv.destinataireId : conv.expediteurId;
    setActivePartner({
      id: partnerId,
      nom: conv.expediteurId === user.id ? (conv.destinataireNomPrenom || 'Utilisateur') : (conv.expediteurNomPrenom || 'Utilisateur'),
      avatar: conv.expediteurId === user.id ? conv.destinataireAvatarUrl : conv.expediteurAvatarUrl,
      projetId: conv.projetId,
      projetTitre: conv.projetTitre
    });
    
    dispatch(getConversation({ user1Id: user.id, user2Id: partnerId })).unwrap().then(messages => {
      // Marquer comme lus les messages du partenaire
      messages.forEach(msg => {
        if (!msg.lu && msg.destinataireId === user.id) {
          dispatch(markAsRead({ messageId: msg.id, userId: user.id }));
        }
      });
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activePartner) return;

    await dispatch(sendMessage({
      expediteurId: user.id,
      destinataireId: activePartner.id,
      projetId: activePartner.projetId,
      contenu: messageText.trim()
    }));
    
    setMessageText('');
  };

  const filteredConversations = conversations.filter(conv => {
    const partnerName = conv.expediteurId === user.id ? (conv.destinataireNomPrenom || '') : (conv.expediteurNomPrenom || '');
    return partnerName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-6 sm:py-12">
      <div className="container mx-auto px-4 max-w-6xl h-[calc(100vh-140px)] min-h-[600px]">
        {/* Main Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 h-full flex overflow-hidden">
          
          {/* Sidebar (Conversations List) */}
          <div className={`w-full md:w-1/3 flex-shrink-0 border-r border-slate-100 flex flex-col ${activePartner ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-6 border-b border-slate-100">
              <h1 className="text-2xl font-display font-black text-slate-900 mb-6">Messages</h1>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher une discussion..." 
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {isLoading && conversations.length === 0 ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary-300 animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-sm font-medium">Aucune conversation trouvée.</p>
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const isSender = conv.expediteurId === user.id;
                  const partnerName = isSender ? (conv.destinataireNomPrenom || 'Utilisateur') : (conv.expediteurNomPrenom || 'Utilisateur');
                  const isActive = activePartner?.id === (isSender ? conv.destinataireId : conv.expediteurId);
                  const isUnread = !isSender && !conv.lu;

                  return (
                    <button 
                      key={`preview-${conv.id}`}
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 ${
                        isActive 
                        ? 'bg-primary-50 border border-primary-100' 
                        : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 overflow-hidden">
                          {isSender && conv.destinataireAvatarUrl ? (
                            <img src={conv.destinataireAvatarUrl} alt={partnerName} className="w-full h-full object-cover" />
                          ) : !isSender && conv.expediteurAvatarUrl ? (
                            <img src={conv.expediteurAvatarUrl} alt={partnerName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </div>
                        {isUnread && (
                          <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className={`text-sm truncate pr-2 ${isActive || isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {partnerName}
                          </h3>
                        </div>
                        <p className={`text-xs truncate ${isUnread ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                          {isSender ? 'Vous: ' : ''}{conv.contenu}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className={`flex-1 flex flex-col bg-slate-50/50 ${!activePartner ? 'hidden md:flex' : 'flex'}`}>
            {activePartner ? (
              <>
                {/* Chat Header */}
                <div className="bg-white p-4 h-20 border-b border-slate-100 flex items-center justify-between px-6">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setActivePartner(null)}
                      className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                      {activePartner.avatar ? (
                        <img src={activePartner.avatar} alt={activePartner.nom} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900">{activePartner.nom}</h2>
                      {activePartner.projetTitre && (
                        <p className="text-[10px] font-bold text-primary-500 uppercase tracking-wider">
                          Projet: {activePartner.projetTitre}
                        </p>
                      )}
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-2 rounded-full">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {currentConversation.map((msg, index) => {
                    const isMe = msg.expediteurId === user.id;
                    const showDate = index === 0 || 
                      new Date(msg.dateEnvoi).getDate() !== new Date(currentConversation[index - 1].dateEnvoi).getDate();

                    return (
                      <React.Fragment key={`msg-${msg.id}`}>
                        {showDate && (
                          <div className="flex justify-center my-6">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                              {new Date(msg.dateEnvoi).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        
                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div 
                            className={`max-w-[75%] lg:max-w-[60%] rounded-2xl px-5 py-3.5 mb-1 ${
                              isMe 
                              ? 'bg-primary-600 text-white rounded-br-sm' 
                              : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-sm'
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.contenu}</p>
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 px-1">
                            {new Date(msg.dateEnvoi).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMe && msg.lu && ' • Lu'}
                          </span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="bg-white p-4 border-t border-slate-100">
                  <form 
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-3 bg-slate-50 p-2 rounded-full border border-slate-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all"
                  >
                    <input 
                      type="text" 
                      placeholder="Écrivez votre message..." 
                      className="flex-1 bg-transparent border-none px-4 text-sm font-medium text-slate-700 outline-none"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      disabled={isSending}
                    />
                    <button 
                      type="submit"
                      disabled={!messageText.trim() || isSending}
                      className="w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white rounded-full flex items-center justify-center transition-colors shadow-sm shadow-primary-500/30"
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 translate-x-[1px] translate-y-[-1px]" />}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <User className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Vos Messages</h3>
                <p className="text-sm">Sélectionnez une conversation pour commencer à discuter avec un porteur de projet ou un investisseur.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Messages;
