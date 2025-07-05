import { create } from 'zustand';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const useNoticeStore = create((set) => ({
  currentNotice: null,
  loading: false,
  error: null,

  // 단건 공지사항 불러오기
  fetchNoticeById: async (id) => {
    set({ loading: true, error: null });
    try {
      const docRef = doc(db, 'announcements', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ currentNotice: { id, ...docSnap.data() }, loading: false });
      } else {
        set({ error: '공지사항을 찾을 수 없습니다.', loading: false });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  clearCurrentNotice: () => set({ currentNotice: null }),
  clearError: () => set({ error: null }),
}));
