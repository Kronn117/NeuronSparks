# API Documentation

## NoteContext

### State

- `notes`: Array of note objects
- `selectedNote`: currently active note
- `searchQuery`: current search input
- `tags`: saved tags
- `stats`: note statistics

### Actions

- `addNote(note)` — create a note
- `updateNote(noteId, updates)` — update existing note
- `deleteNote(noteId)` — delete a note
- `togglePin(noteId)` — pin or unpin a note
- `searchNotes(query)` — search notes
- `loadNotes()` — load notes from AsyncStorage

## StorageService

### Methods

- `getNotes()` — read notes from storage
- `saveNotes(notes)` — persist notes
- `deleteNote(noteId)` — remove a note from storage
- `clearAll()` — clear stored data

## ValidationService

### Methods

- `validateTitle(title)` — returns boolean and message
- `validateContent(content)` — returns boolean and message
- `validateTags(tags)` — returns boolean and message
- `validateColor(color)` — returns boolean

## SearchService

### Methods

- `searchNotes(notes, query)` — filter by title/content/tags
- `highlightMatches(text, query)` — optional UI helper

## Theme API

### Properties

- `colors`
- `spacing`
- `fonts`
- `borderRadius`

## Navigation

### Routes

- `HomeScreen`
- `SearchScreen`
- `CreateModal`
- `DetailScreen`
- `SettingsScreen`

### Parameters

- `DetailScreen` expects `noteId`
- `CreateModal` can receive `noteId` for editing
