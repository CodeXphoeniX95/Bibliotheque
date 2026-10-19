const COVER_COLORS = [
  ['#2d4a3e', '#4a7c59'],
  ['#8b3a2a', '#c4614d'],
  ['#1a3a5c', '#2e6494'],
  ['#4a3728', '#8b6348'],
  ['#3d2b5e', '#6b4a9e'],
  ['#1c4a3e', '#2e7d5a'],
]

function getCoverColor(id) {
  return COVER_COLORS[id % COVER_COLORS.length]
}

export default function BookCard({ book, onClick }) {
  const [c1, c2] = getCoverColor(book.id || 0)

  return (
    <div className="book-card" onClick={() => onClick(book)}>
      {!book.disponible && <span className="book-badge">Emprunté</span>}
      <div
        className="book-cover"
        style={{ background: `linear-gradient(150deg, ${c1}, ${c2})` }}
      >
        <span className="book-cover-text">{book.titre}</span>
      </div>
      <div className="book-info">
        <div className="book-title">{book.titre}</div>
        <div className="book-author">{book.auteur}</div>
        <div className="book-meta">
          <span className="book-genre">{book.genre || 'Divers'}</span>
          <span className={`book-available ${book.disponible ? 'yes' : 'no'}`}>
            {book.disponible ? '✓ Dispo' : '✗ Indispo'}
          </span>
        </div>
      </div>
    </div>
  )
}
