import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageService from '../../services/messageService';

export const sendMessage = createAsyncThunk(
  'messages/send',
  async (messageData, thunkAPI) => {
    try {
      return await messageService.sendMessage(messageData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getConversation = createAsyncThunk(
  'messages/getConversation',
  async ({ user1Id, user2Id }, thunkAPI) => {
    try {
      return await messageService.getConversation(user1Id, user2Id);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getRecentConversations = createAsyncThunk(
  'messages/getRecentConversations',
  async (userId, thunkAPI) => {
    try {
      return await messageService.getRecentConversations(userId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  'messages/getUnreadCount',
  async (userId, thunkAPI) => {
    try {
      return await messageService.getUnreadCount(userId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'messages/markAsRead',
  async ({ messageId, userId }, thunkAPI) => {
    try {
      await messageService.markAsRead(messageId, userId);
      return messageId;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  conversations: [], // Liste des previews
  currentConversation: [], // Les messages du chat actuel
  unreadCount: 0,
  isLoading: false,
  isSending: false,
  error: null,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessageToConversation: (state, action) => {
      state.currentConversation.push(action.payload);
    },
    resetCurrentConversation: (state) => {
      state.currentConversation = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // getRecentConversations
      .addCase(getRecentConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecentConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(getRecentConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // getConversation
      .addCase(getConversation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation = action.payload;
      })
      .addCase(getConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // getUnreadCount
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        state.currentConversation.push(action.payload);
        
        // Mettre à jour (ou ajouter) la preview de conversation
        const destId = action.payload.destinataireId;
        const convIndex = state.conversations.findIndex(
          c => c.expediteurId === destId || c.destinataireId === destId
        );
        
        if (convIndex !== -1) {
          state.conversations[convIndex] = action.payload;
        } else {
          state.conversations.unshift(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })
      // markAsRead
      .addCase(markAsRead.fulfilled, (state, action) => {
        const msg = state.currentConversation.find(m => m.id === action.payload);
        if (msg) msg.lu = true;
        
        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      });
  },
});

export const { addMessageToConversation, resetCurrentConversation } = messageSlice.actions;

export default messageSlice.reducer;
