"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // 1. 방명록 데이터 가져오기
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.error('데이터 로드 실패:', error)
    else setMessages(data)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  // 2. 방명록 작성하기
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setLoading(true)
    const { error } = await supabase
      .from('guestbook')
      .insert([{ name, message }])

    setLoading(false)
    if (error) {
      alert('등록에 실패했습니다.')
      console.error(error)
    } else {
      setName('')
      setMessage('')
      fetchMessages() // 목록 새로고침
    }
  }

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>✨ 바이브 코딩 방명록</h1>
      
      {/* 등록 폼 */}
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>이름</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="이름을 입력하세요"
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>메시지</label>
          <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="남길 말씀을 적어주세요"
            rows="3"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? '등록 중...' : '방명록 남기기'}
        </button>
      </form>

      {/* 목록 출력 */}
      <div>
        <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px' }}>최근 메시지 ({messages.length})</h2>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>첫 번째 메시지를 남겨보세요!</p>
        ) : (
          messages.map((item) => (
            <div key={item.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '6px', marginBottom: '10px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'between', marginBottom: '5px' }}>
                <strong style={{ color: '#0070f3' }}>{item.name}</strong>
                <span style={{ fontSize: '12px', color: '#999', marginLeft: 'auto' }}>
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div>
              <p style={{ margin: 0, color: '#333', whiteSpace: 'pre-wrap' }}>{item.message}</p>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
