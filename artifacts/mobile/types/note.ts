export type NoteColor =
  | '#00f5ff'
  | '#ff00aa'
  | '#9b4dff'
  | '#39ff14'
  | '#ffaa00'
  | '#ff3355';

export type NoteCategory =
  | 'General'
  | 'Work'
  | 'Ideas'
  | 'Code'
  | 'Research'
  | 'Personal';

export interface Note {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  category: NoteCategory;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export const NOTE_COLORS: NoteColor[] = [
  '#00f5ff',
  '#ff00aa',
  '#9b4dff',
  '#39ff14',
  '#ffaa00',
  '#ff3355',
];

export const NOTE_COLOR_LABELS: Record<NoteColor, string> = {
  '#00f5ff': 'Cyan',
  '#ff00aa': 'Magenta',
  '#9b4dff': 'Violet',
  '#39ff14': 'Green',
  '#ffaa00': 'Amber',
  '#ff3355': 'Red',
};

export const NOTE_CATEGORIES: NoteCategory[] = [
  'General',
  'Work',
  'Ideas',
  'Code',
  'Research',
  'Personal',
];
