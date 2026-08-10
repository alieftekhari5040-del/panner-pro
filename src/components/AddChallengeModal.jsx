import { useState } from 'react'

export default function AddChallengeModal({ onClose, onAdd, emojis }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [baseTarget, setBaseTarget] = useState('10')
  const [selectedEmoji, setSelectedEmoji] = useState('📚')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    if (!baseTarget || parseInt(baseTarget) < 1) return

    onAdd({
      title: title.trim(),
      description: description.trim(),
      emoji: selectedEmoji,
      baseTarget: parseInt(baseTarget),
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>
          <span>⚔️</span>
          چالش جدید
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>آیکون چالش</label>
            <div className="emoji-picker">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  className={`emoji-option ${selectedEmoji === emoji ? 'selected' : ''}`}
                  onClick={() => setSelectedEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>عنوان چالش *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="مثلاً: مطالعه متمرکز"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>توضیحات</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="توضیح مختصر درباره چالش..."
            />
          </div>

          <div className="form-group">
            <label>تعداد پایه (تیک‌های لازم برای اولین مدال) *</label>
            <input
              type="number"
              value={baseTarget}
              onChange={e => setBaseTarget(e.target.value)}
              min="1"
              max="1000"
              placeholder="10"
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              💡 برای مدال‌های بالاتر، تعداد تیک‌های لازم بیشتر میشه (ضریب ×۱.۵، ×۲ و...)
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              انصراف
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim() || !baseTarget || parseInt(baseTarget) < 1}
            >
              ✨ ساخت چالش
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
