import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Cards.css';
import Review from './Review';

export default function Cards() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [card, setCard] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [inCart, setInCart] = useState(false);
    const [imageUrls, setImageUrls] = useState({});

    const token = localStorage.getItem("jwtToken");

    useEffect(() => {
        const fetchCard = async () => {
            try {
                const response = await fetch(`http://localhost:8080/card/${id}`);
                if (!response.ok) throw new Error("Ошибка при получении карточки");
                const data = await response.json();
                setCard(data);

                if (data.images && data.images.length > 0) {
                    const urls = {};
                    for (let imgObj of data.images) {
                        try {
                            const res = await fetch(`http://localhost:8080${imgObj.imageUrl}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            const blob = await res.blob();
                            urls[imgObj.imageUrl] = URL.createObjectURL(blob);
                        } catch (err) {
                            console.error("Ошибка при загрузке изображения", imgObj.imageUrl, err);
                        }
                    }
                    setImageUrls(urls);
                    setMainImage(urls[data.images[0].imageUrl]);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchCard();
        
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setInCart(storedCart.some(item => item.id === Number(id)));
    }, [id, token]);

    const goBack = () => navigate("/");

    if (!card) return <div>Загрузка...</div>;

    const addToCart = () => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = storedCart.find(item => item.id === card.id);
        if (!existing) {
            storedCart.push({
                id: card.id,
                brand: card.brand,
                title: card.title,
                price: card.price,
                image: card.images && card.images.length > 0
                    ? imageUrls[card.images[0].imageUrl]
                    : null
            });
            localStorage.setItem('cart', JSON.stringify(storedCart));
            setInCart(true);
        }
        navigate("/order");
    };

    const leftImages = card.images ? card.images.slice(0, 4) : [];
    const miniImages = card.images ? card.images.slice(0, 2) : [];

    const getImageUrl = (url) => imageUrls[url] || ""; 

    return (
        <div className='cards-container'>
            <button className='back-button' onClick={goBack}>НАЗАД</button>
            <div className='card-name'>{card.brand} / {card.title}</div>
            <div className='articule-row'>
                <div className='articul'>Артикул: 12345678</div>
                <div className='stars-container'>
                    <div className='star'></div>
                    <div className='star'></div>
                    <div className='star'></div>
                    <div className='star'></div>
                    <div className='star'></div>
                </div>
                <div className='feedback'>0 отзывов</div>
            </div>

            <div className='cards-images'>
                <div className='left-images'>
                    {leftImages.map((imgObj, index) => (
                        <div
                            key={index}
                            className='card-image'
                            style={{
                                border: mainImage === getImageUrl(imgObj.imageUrl)
                                    ? '3px solid rgba(254, 179, 255, 0.907)'
                                    : 'none',
                                borderRadius: '5px',
                                backgroundImage: `url(${getImageUrl(imgObj.imageUrl)})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                cursor: 'pointer'
                            }}
                            onClick={() => setMainImage(getImageUrl(imgObj.imageUrl))}
                        />
                    ))}
                </div>

                <div className='main-card-side'>
                    <div
                        className='main-image-placeholder'
                        style={{
                            backgroundImage: mainImage ? `url(${mainImage})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />

                    <div className='card-info'>
                        <div className='cards-price'>{card.price}₽</div>
                        <div className='color'>Цвет: бежевый</div>

                        <div className='mini-images'>
                            {miniImages.map((imgObj, index) => (
                                <div
                                    key={index}
                                    className='card-image'
                                    style={{
                                        backgroundImage: `url(${getImageUrl(imgObj.imageUrl)})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: 'pointer',
                                        border: mainImage === getImageUrl(imgObj.imageUrl)
                                            ? '3px solid rgba(254, 179, 255, 0.907)'
                                            : 'none',
                                        borderRadius: '5px'
                                    }}
                                    onClick={() => setMainImage(getImageUrl(imgObj.imageUrl))}
                                />
                            ))}
                        </div>

                        <div className='table-name'>Таблица размеров</div>
                        <div className='table-of-sizing'>
                            <div className='size'>XS</div>
                            <div className='size'>S</div>
                            <div className='size'>M</div>
                            <div className='size'>L</div>
                        </div>

                        <div className='order-card'>
                            <button className='add-to-order' onClick={addToCart}>
                                {inCart ? 'Перейти в корзину' : 'ДОБАВИТЬ В КОРЗИНУ'}
                            </button>
                        </div>

                        <div className='dilivery'>Доставка ориентировочно 12 февраля</div>
                        <div className='company-name'>{card.brand}</div>
                    </div>
                </div>
            </div>

            {card && <Review cardId={card.id}/>}
        </div>
    );
}
