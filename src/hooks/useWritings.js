import { useState, useEffect } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const COLLECTION = import.meta.env.VITE_FIRESTORE_COLLECTION || 'posts'

/**
 * Map a raw Firestore document to the shape the UI expects.
 * Notion field names (Title, Written Date, etc.) are normalised here
 * so every component works with consistent lowercase keys.
 */
function mapDoc(id, data) {
  return {
    slug:      id,
    title:     data.Title     || data.title     || '',
    date:      data['Written Date'] || data.date || '',
    excerpt:   data.excerpt   || '',
    content:   data.content   || '',
    cover_url: data.cover_url || null,
    tags:      data.tags      || [],
    status:    data.status    || null,
    featured:  data.fetured   ?? data.featured  ?? false,
    notionUrl: data.url       || null,
    // keep everything else available too
    ...data,
  }
}

/** Fetch all writings from Firestore. */
export function useWritings() {
  const [writings, setWritings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    getDocs(collection(db, COLLECTION))
      .then(snapshot => {
        const docs = snapshot.docs.map(d => mapDoc(d.id, d.data()))
        setWritings(docs)
      })
      .catch(err => { console.error('[useWritings] Firestore error:', err); setError(err) })
      .finally(() => setLoading(false))
  }, [])

  return { writings, loading, error }
}

/** Fetch a single writing by its Firestore doc ID (the :slug in the URL). */
export function useWriting(docId) {
  const [writing, setWriting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!docId) { setLoading(false); return }

    getDoc(doc(db, COLLECTION, docId))
      .then(snap => {
        setWriting(snap.exists() ? mapDoc(snap.id, snap.data()) : null)
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [docId])

  return { writing, loading, error }
}
