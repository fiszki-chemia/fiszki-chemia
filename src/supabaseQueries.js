import { supabase } from './supabase.js'

export async function getFlashcardsWithViewed(userId, topic) {
  try {
    const { data: flashcards, error: fcError } = await supabase
      .from('flashcards')
      .select('id, topic, topic_name, question, answer')
      .eq('topic', topic)
    if (fcError) throw fcError

    const { data: viewed, error: vError } = await supabase
      .from('user_flashcards')
      .select('flashcard_id, viewed, created_at')
      .eq('user_id', userId)
      .eq('topic', topic)
    if (vError) throw vError

    const viewedMap = new Map(
      viewed.map(v => [v.flashcard_id, { viewed: v.viewed, viewed_at: v.created_at }])
    )

    return flashcards.map(f => ({
      ...f,
      viewed: viewedMap.get(f.id)?.viewed || false,
      viewed_at: viewedMap.get(f.id)?.viewed_at || null,
    }))
  } catch (err) {
    console.error('Błąd pobierania fiszek:', err)
    return []
  }
}

export async function markAsViewed(userId, flashcardId, topic) {
  if (!userId || !flashcardId) return false

  try {
    const { data: existing } = await supabase
      .from('user_flashcards')
      .select('*')
      .eq('user_id', userId)
      .eq('flashcard_id', flashcardId)
      .single()

    if (existing?.viewed) return false

    const { error } = await supabase
      .from('user_flashcards')
      .upsert({
        user_id: userId,
        flashcard_id: flashcardId,
        topic,
        viewed: true,
      })
    if (error) throw error

    return true
  } catch (err) {
    console.error('Błąd zapisu obejrzenia fiszki:', err)
    return false
  }
}

export async function getProgress(userId, topic) {
  try {
    const { data: flashcards, error: fcError } = await supabase
      .from('flashcards')
      .select('id')
      .eq('topic', topic)
    if (fcError) throw fcError

    const { data: viewed, error: vError } = await supabase
      .from('user_flashcards')
      .select('flashcard_id')
      .eq('user_id', userId)
      .eq('topic', topic)
      .eq('viewed', true)
    if (vError) throw vError

    return { viewed: viewed.length, total: flashcards.length }
  } catch (err) {
    console.error('Błąd pobierania postępu:', err)
    return { viewed: 0, total: 0 }
  }
}

export async function resetProgress(userId, topic) {
  if (!userId || !topic) return false

  try {
    const { error } = await supabase
      .from('user_flashcards')
      .delete()
      .eq('user_id', userId)
      .eq('topic', topic)
    if (error) throw error
    return true
  } catch (err) {
    console.error('Błąd resetowania postępu:', err)
    return false
  }
}

export async function getTopics() {
  try {
    // pobieramy wszystkie tematy
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('id, topic, topic_name')
      .order('id', { ascending: true })
    if (topicsError) throw topicsError
    if (!topics || topics.length === 0) return []

    // pobieramy wszystkie fiszki
    const { data: flashcards, error: fcError } = await supabase
      .from('flashcards')
      .select('topic')
    if (fcError) throw fcError

    if (!flashcards || flashcards.length === 0) return []

    // filtrujemy tematy, które mają co najmniej jedną fiszkę
    const topicsWithFlashcards = topics.filter(t =>
      flashcards.some(f => f.topic === t.topic)
    )

    return topicsWithFlashcards
  } catch (err) {
    console.error('Błąd pobierania tematów:', err)
    return []
  }
}