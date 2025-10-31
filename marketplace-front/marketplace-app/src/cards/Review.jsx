import { useState, useEffect } from 'react';
import './Review.css';

export default function Review({ cardId }) {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [content, setContent] = useState('');
    const [cardInfo, setCardInfo] = useState({ brand: '', title: '' });

    const jwtToken = localStorage.getItem('jwtToken');
    const storedUsername = localStorage.getItem('username') || 'Вы';

    useEffect(() => {
        if (!cardId) return;
        const fetchCard = async () => {
            try {
                const res = await fetch(`https://market-place-yn4a.onrender.com/card/${cardId}`);
                if (!res.ok) return;
                const data = await res.json();
                setCardInfo({ brand: data.brand, title: data.title });
            } catch (err) {
                console.error(err);
            }
        };
        fetchCard();
    }, [cardId]);

    useEffect(() => {
        if (!cardId) return;
        const fetchReviews = async () => {
            try {
                const res = await fetch(`https://market-place-yn4a.onrender.com/reviews/${cardId}`);
                if (!res.ok) return;
                const data = await res.json();
                setReviews(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchReviews();
    }, [cardId]);

    const submitReview = async () => {
        if (!content || rating === 0) {
            alert('Пожалуйста, заполните отзыв и выберите рейтинг!');
            return;
        }

        if (!jwtToken) {
            alert('Сначала войдите в аккаунт');
            return;
        }

        try {
            const res = await fetch(`https://market-place-yn4a.onrender.com/create/${cardId}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({ content, rating })
            });

            if (!res.ok) throw new Error('Ошибка при отправке отзыва');
            const newReview = await res.json();

            const reviewWithFullInfo = {
                ...newReview,
                author: { username: storedUsername },
                card: { ...cardInfo }
            };

            setReviews([reviewWithFullInfo, ...reviews]);
            setContent('');
            setRating(0);
            setHover(0);
        } catch (err) {
            console.error(err);
            alert('Не удалось отправить отзыв');
        }
    };

    const averageRating = reviews.length
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    return (
        <div className="reviews-container">
            <div className="reviews-title" style={{ marginTop: '25px' }}>Отзывы</div>

            <div className="reviews-average" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div className="average-rating" style={{ fontSize: '22px', fontWeight: 700 }}>{averageRating.toFixed(1)}</div>
                <div className="average-stars" style={{ display: 'flex', gap: '4px' }}>
                    {[1,2,3,4,5].map((i) => (
                        <div key={i} className={`star ${i <= Math.round(averageRating) ? 'filled' : ''}`}></div>
                    ))}
                </div>
            </div>

            {jwtToken && (
                <div className="add-review-card">
                    <div className="add-review-header">
                        <div className="avatar small"></div>
                        <div className="add-review-info">
                            <div className="add-review-title">{storedUsername}</div>
                            <div className="add-stars">
                                {[1,2,3,4,5].map((star) => (
                                    <div
                                        key={star}
                                        className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(rating)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <textarea
                        className="review-input"
                        placeholder="Поделитесь впечатлениями о товаре..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <button className="submit-review-btn" onClick={submitReview}>
                        Отправить отзыв
                    </button>
                </div>
            )}

            {reviews.map((review) => (
                <div key={review.id} className="review-card">
                    <div className="review-top">
                        <div className="review-left">
                            <div className="avatar"></div>
                            <div className="author-info">
                                <div className="author-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div className="author-name">{review.author?.username || 'Пользователь'}</div>
                                    <div className="stars" style={{ display: 'flex', gap: '4px' }}>
                                        {[1,2,3,4,5].map((i) => (
                                            <div key={i} className={`star ${i <= review.rating ? 'filled' : ''}`}></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="product-title">
                                    {review.card ? `${review.card.brand} / ${review.card.title}` : ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="review-content">{review.content}</div>
                </div>
            ))}
        </div>
    );
}
