import { useState, useEffect } from 'react';
import './Store.css';
import LeftSideProperties from '../cards/LeftSideProperties';
import { useNavigate } from 'react-router-dom';

export default function Store() {
    const navigate = useNavigate();

    const [filter, setFilter] = useState("all");
    const [cards, setCards] = useState([]);
    const [ratings, setRatings] = useState({});
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortAsc, setSortAsc] = useState(true);

    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        loadAllCards();
    }, []);

    useEffect(() => {
        const fetchRatings = async () => {
            const newRatings = {};
            for (let card of cards) {
                try {
                    const res = await fetch(`https://market-place-yn4a.onrender.com/reviews/${card.id}`);
                    if (!res.ok) continue;
                    const reviews = await res.json();
                    if (reviews.length === 0) {
                        newRatings[card.id] = 0;
                        continue;
                    }
                    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
                    newRatings[card.id] = avg;
                } catch (err) {
                    console.error(err);
                    newRatings[card.id] = 0;
                }
            }
            setRatings(newRatings);
        };

        if (cards.length > 0) fetchRatings();
    }, [cards]);

    const loadAllCards = async () => {
        setFilter("Все");
        try {
            const res = await fetch(`https://market-place-yn4a.onrender.com/cards`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Ошибка при загрузке всех карточек");
            const data = await res.json();
            setCards(data);
        } catch (err) {
            console.error(err);
            setCards([]);
        }
    };

    const filterByCategory = async (category) => {
        setFilter(category);
        try {
            const res = await fetch(`https://market-place-yn4a.onrender.com/category/${encodeURIComponent(category)}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Ошибка при получении карточек по категории");
            const data = await res.json();
            setCards(data);
        } catch (err) {
            console.error(err);
            setCards([]);
        }
    };

    const openCard = (id) => {
        navigate(`/catalog/${id}`);
    };

    const toggleChat = () => {
        setIsChatOpen(prev => !prev);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (inputValue.trim() === "") return;
        const newMessage = { text: inputValue, sender: "user" };
        setMessages(prev => [...prev, newMessage]);
        setInputValue("");
    };

    const sortCards = (criteria) => {
        let sortedCards = [...cards];

        if (sortBy === criteria) {
            setSortAsc(!sortAsc);
        } else {
            setSortAsc(true);
        }
        setSortBy(criteria);

        sortedCards.sort((a, b) => {
            switch(criteria) {
                case "price":
                    return sortAsc ? a.price - b.price : b.price - a.price;
                case "rating":
                    const ratingA = ratings[a.id] || 0;
                    const ratingB = ratings[b.id] || 0;
                    return sortAsc ? ratingA - ratingB : ratingB - ratingA;
                case "popularity":
                    return sortAsc ? (a.popularity || 0) - (b.popularity || 0) : (b.popularity || 0) - (a.popularity || 0);
                default:
                    return 0;
            }
        });

        setCards(sortedCards);
    };

    return (
        <div className='store-container'>
            <LeftSideProperties />

            <div className='store-feed'>
                <div className='add'/>

                <div className='tags'>
                    <div className='tag'>Главная</div>
                    <div className='tag'>Женское</div>
                    <div className='tag'>Одежда</div>
                </div>

                <div className='category'>Категория: {filter}</div>

                <div className='popular-requests-container'>
                    <div
                        className={`request ${filter === "Все" ? 'active' : ''}`}
                        onClick={loadAllCards}
                    >
                        Все
                    </div>
                    <div
                        className={`request ${filter === "Женская одежда" ? 'active' : ''}`}
                        onClick={() => filterByCategory("Женская одежда")}
                    >
                        Женская одежда
                    </div>
                    <div
                        className={`request ${filter === "Мужская одежда" ? 'active' : ''}`}
                        onClick={() => filterByCategory("Мужская одежда")}
                    >
                        Мужская одежда
                    </div>
                    <div
                        className={`request ${filter === "Предметы для взрослых" ? 'active' : ''}`}
                        onClick={() => filterByCategory("Предметы для взрослых")}
                    >
                        Предметы для взрослых
                    </div>
                    <div
                        className={`request ${filter === "Другое" ? 'active' : ''}`}
                        onClick={() => filterByCategory("Другое")}
                    >
                        Другое
                    </div>
                </div>

                <div className='sorted-by-container'>
                    <div className='sorted-text'>Сортировать по: </div>
                    <div className='sort' onClick={() => sortCards("popularity")}>
                        Популярности {sortBy === "popularity" ? (sortAsc ? "↑" : "↓") : ""}
                    </div>
                    <div className='sort' onClick={() => sortCards("rating")}>
                        Рейтингу {sortBy === "rating" ? (sortAsc ? "↑" : "↓") : ""}
                    </div>
                    <div className='sort' onClick={() => sortCards("price")}>
                        Цене {sortBy === "price" ? (sortAsc ? "↑" : "↓") : ""}
                    </div>
                    <div className='sort'>Скидке</div>
                    <div className='sort'>Обновлению</div>
                </div>

                <div className='cards'>
                    {cards.length === 0 ? (
                        <div>Пока нет карточек</div>
                    ) : (
                        cards.map((card, index) => {
                            const avgRating = ratings[card.id] || 0;
                            return (
                                <div
                                    key={`${card.id}-${index}`}
                                    className='s-card'
                                    onClick={() => openCard(card.id)}
                                >
                                    <div
                                        className='card-logo-placeholder'
                                        style={{
                                            backgroundImage: card.images && card.images.length > 0
                                                ? `url(${encodeURI(`https://market-place-yn4a.onrender.com${card.images[0].imageUrl}`)})`
                                                : 'linear-gradient(135deg, #f1deba 0%, #fff3ea 100%)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />

                                    <div className='card-price'>{card.price}₽</div>
                                    <div className='card-disciption'>
                                        {card.brand} / {card.title} 
                                    </div>
                                    <div className='sale'>2+1 при оплате картой</div>
                                    <div className='stars-container' style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <div className='average-rating-text' style={{ fontWeight: 400 }}>{avgRating.toFixed(1)}</div>
                                        {[1,2,3,4,5].map((i) => (
                                            <div key={i} className={`star ${i <= Math.round(avgRating) ? 'filled' : ''}`}></div>
                                        ))}
                                    </div>

                                    <button className='delivery-button'><b>Завтра</b></button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className='chat-container'>
                {!isChatOpen ? (
                    <button className='gpt-button' onClick={toggleChat}>
                        <span className='shine'></span>
                        Marketplace GPT
                    </button>
                ) : (
                    <div className='chat-window'>
                        <div className='chat-header'>
                            <img
                                src='https://cdn-icons-png.flaticon.com/512/4712/4712027.png'
                                alt='bot-avatar'
                                className='bot-avatar'
                            />
                            <span className='chat-title'>Marketplace GPT</span>
                            <button className='close-chat' onClick={toggleChat}>—</button>
                        </div>
                        <div className='chat-messages'>
                            {messages.length === 0 ? (
                                <div className='empty-chat'>Напиши сообщение 👋</div>
                            ) : (
                                messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
                                    >
                                        {msg.text}
                                    </div>
                                ))
                            )}
                        </div>
                        <form className='chat-input-container' onSubmit={handleSend}>
                            <input
                                type='text'
                                placeholder='Введите сообщение...'
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button type='submit'>Отправить</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
