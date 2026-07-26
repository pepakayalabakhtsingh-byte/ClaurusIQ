import { useEffect, useState } from 'react';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineChatAlt2 } from 'react-icons/hi';
import api from '../../services/api';

const ChatSidebar = ({ activeId, onSelect, onNewChat }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/chat/history');
      setConversations(res.data.data || []);
    } catch (err) {
      console.error('Failed to load chat history', err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/${id}`);
      setConversations(prev => prev.filter(c => c._id !== id));
      if (activeId === id) onNewChat();
    } catch (err) {
      console.error('Failed to delete conversation', err);
    }
  };

  return (
    <div className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-500 text-white font-bold text-sm hover:bg-primary-600 transition-colors cursor-pointer"
        >
          <HiOutlinePlus className="w-4 h-4" /> New Chat
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {conversations.length === 0 && (
          <p className="text-center text-xs text-slate-400 mt-6">No conversations yet.</p>
        )}
        {conversations.map(c => (
          <button
            key={c._id}
            onClick={() => onSelect(c._id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors group cursor-pointer ${
              activeId === c._id
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <HiOutlineChatAlt2 className="w-4 h-4 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{c.title}</p>
              <p className="text-[10px] text-slate-400 truncate">{c.lastMessage}</p>
            </div>
            <button
              onClick={(e) => handleDelete(e, c._id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
            >
              <HiOutlineTrash className="w-3.5 h-3.5" />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
