import { createSlice } from '@reduxjs/toolkit';
import { DESIGN_TOOLS } from '../../utils/constants';

const initialState = {
  canvas: null,
  selectedTool: DESIGN_TOOLS.TEXT,
  selectedObject: null,
  history: [],
  historyIndex: -1,
  isDrawing: false,
  settings: {
    strokeColor: '#000000',
    fillColor: '#ffffff',
    strokeWidth: 2,
    fontSize: 16,
    fontFamily: 'Arial',
    opacity: 1,
  },
  templates: [],
  customDesigns: [],
  currentDesign: {
    id: null,
    name: '',
    elements: [],
    background: '#ffffff',
    dimensions: {
      width: 400,
      height: 400,
    },
  },
  isSaving: false,
  error: null,
};

const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    setCanvas: (state, action) => {
      state.canvas = action.payload;
    },
    setSelectedTool: (state, action) => {
      state.selectedTool = action.payload;
    },
    setSelectedObject: (state, action) => {
      state.selectedObject = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setIsDrawing: (state, action) => {
      state.isDrawing = action.payload;
    },
    
    // History management
    addToHistory: (state, action) => {
      const newState = action.payload;
      // Remove any history after current index
      state.history = state.history.slice(0, state.historyIndex + 1);
      // Add new state
      state.history.push(newState);
      state.historyIndex = state.history.length - 1;
      // Limit history size
      if (state.history.length > 50) {
        state.history.shift();
        state.historyIndex--;
      }
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        const previousState = state.history[state.historyIndex];
        if (state.canvas && previousState) {
          state.canvas.loadFromJSON(previousState, () => {
            state.canvas.renderAll();
          });
        }
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const nextState = state.history[state.historyIndex];
        if (state.canvas && nextState) {
          state.canvas.loadFromJSON(nextState, () => {
            state.canvas.renderAll();
          });
        }
      }
    },
    clearHistory: (state) => {
      state.history = [];
      state.historyIndex = -1;
    },
    
    // Design management
    setCurrentDesign: (state, action) => {
      state.currentDesign = { ...state.currentDesign, ...action.payload };
    },
    addElement: (state, action) => {
      state.currentDesign.elements.push(action.payload);
    },
    updateElement: (state, action) => {
      const { id, updates } = action.payload;
      const elementIndex = state.currentDesign.elements.findIndex(el => el.id === id);
      if (elementIndex !== -1) {
        state.currentDesign.elements[elementIndex] = {
          ...state.currentDesign.elements[elementIndex],
          ...updates,
        };
      }
    },
    removeElement: (state, action) => {
      const elementId = action.payload;
      state.currentDesign.elements = state.currentDesign.elements.filter(
        el => el.id !== elementId
      );
    },
    clearDesign: (state) => {
      state.currentDesign = {
        id: null,
        name: '',
        elements: [],
        background: '#ffffff',
        dimensions: {
          width: 400,
          height: 400,
        },
      };
      state.history = [];
      state.historyIndex = -1;
    },
    
    // Templates and custom designs
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    addCustomDesign: (state, action) => {
      state.customDesigns.push(action.payload);
    },
    updateCustomDesign: (state, action) => {
      const { id, updates } = action.payload;
      const designIndex = state.customDesigns.findIndex(design => design.id === id);
      if (designIndex !== -1) {
        state.customDesigns[designIndex] = {
          ...state.customDesigns[designIndex],
          ...updates,
        };
      }
    },
    removeCustomDesign: (state, action) => {
      const designId = action.payload;
      state.customDesigns = state.customDesigns.filter(design => design.id !== designId);
    },
    
    // Canvas operations
    clearCanvas: (state) => {
      if (state.canvas) {
        state.canvas.clear();
        state.canvas.setBackgroundColor('#ffffff', state.canvas.renderAll.bind(state.canvas));
      }
      state.currentDesign.elements = [];
    },
    exportCanvas: (state) => {
      if (state.canvas) {
        return state.canvas.toDataURL({
          format: 'png',
          quality: 1,
        });
      }
      return null;
    },
    
    // Loading states
    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCanvas,
  setSelectedTool,
  setSelectedObject,
  setSettings,
  setIsDrawing,
  addToHistory,
  undo,
  redo,
  clearHistory,
  setCurrentDesign,
  addElement,
  updateElement,
  removeElement,
  clearDesign,
  setTemplates,
  addCustomDesign,
  updateCustomDesign,
  removeCustomDesign,
  clearCanvas,
  exportCanvas,
  setSaving,
  clearError,
  setError,
} = designSlice.actions;

export default designSlice.reducer;
