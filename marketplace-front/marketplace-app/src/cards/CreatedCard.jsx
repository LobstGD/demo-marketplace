import { useState, useEffect } from 'react';
import './CreatedCard.css';
import LeftSideProperties from './LeftSideProperties';
import { useNavigate } from 'react-router-dom';

export default function CreatedCard() {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [imageUrls, setImageUrls] = useState({}); 

    const createCardPage = () => navigate('/create');

    const getImageWithToken = async (imagePath) => {
        if (imageUrls[imagePath]) return imageUrls[imagePath]; 
        try {
            const token = localStorage.getItem('jwtToken');
            const res = await fetch(`http://localhost:8080${imagePath}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setImageUrls(prev => ({ ...prev, [imagePath]: url }));
            return url;
        } catch (err) {
            console.error("Ошибка при загрузке изображения", imagePath, err);
            return '/placeholder.png';
        }
    };

    useEffect(() => {
        const fetchMyCards = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const res = await fetch('http://localhost:8080/my-cards', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Не удалось получить карточки");
                let data = await res.json();

                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setCards(data);

                data.forEach(card => {
                    if (card.images && card.images.length > 0) {
                        getImageWithToken(card.images[0].imageUrl);
                    }
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchMyCards();
    }, []);

    const openCard = async (id) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`http://localhost:8080/card/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Ошибка при получении карточки");
            const data = await response.json();
            localStorage.setItem('currentCard', JSON.stringify(data));
            navigate(`/catalog/${id}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='create-card-container'>
            <LeftSideProperties />
            <div className='main-create-container'>
                <div className='с-first-row'>
                    <div className='с-property-title'><b>Создание карточек товара</b></div>
                    <button className='instruction-button'>Инструкция</button>
                    <button className='create-button' onClick={createCardPage}>
                        Создать одну карточку
                    </button>
                </div>

                <div className='show-cards-row'>
                    <div className='cards-show'>Все карточки</div>
                    <div className='cards-show'>Архив</div>
                </div>

                <div className='created-card-table'>
                    <div className='first-table-row'>
                        <div className='column first'>Товар</div>
                        <div className='column second'>Категория</div>
                        <div className='column third'>Код товара</div>
                        <div className='column fourth'>Дата создания</div>
                        <div className='column fifth'>Статус</div>
                    </div>

                    {cards.map((card, index) => (
                        <div
                            key={`${card.id}-${index}`} 
                            className='second-table-row'
                            style={{ cursor: 'pointer' }}
                            onClick={() => openCard(card.id)}
                        >
                            <div className='product-container'>
                                <img
                                    src={
                                        card.images && card.images.length > 0
                                            ? imageUrls[card.images[0].imageUrl] || '/placeholder.png'
                                            : '/placeholder.png'
                                    }
                                    alt={card.title}
                                    className='mini-card-image'
                                />
                                <div className='column-card'>
                                    <div className='mini-card-name-table'>{card.title}</div>
                                    <div className='content'>{card.content}</div>
                                    <div className='articul'>Артикул: 12345678</div>
                                </div>
                            </div>
                            <div className='category-container'>
                                <div className='category-name'>{card.category}</div>
                            </div>
                            <div className='code-container'>
                                <div className='code-of-card'>123456</div>
                            </div>
                            <div className='date-container'>
                                <div className='date'>
                                    {card.createdAt
                                        ? new Date(card.createdAt).toLocaleDateString()
                                        : new Date().toLocaleDateString()}
                                </div>
                            </div>
                            <div className='status'>Опубликовано</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
