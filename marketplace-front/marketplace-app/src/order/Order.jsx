import { useState, useEffect } from 'react';
import './Order.css';
import { useNavigate } from 'react-router-dom';

export default function Order() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [amount, setAmount] = useState(9.99);
    const [discription, setDiscription] = useState("");

    const [city, setCity] = useState('Москва');
    const [address, setAddress] = useState('Обводное шоссе');
    const [isEditingDelivery, setIsEditingDelivery] = useState(false);

    const token = localStorage.getItem("jwtToken");

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(storedCart);
    }, []);

    useEffect(() => {
        const sum = cart.reduce((acc, item) => acc + Number(item.price), 0);
        setTotalPrice(sum);
    }, [cart]);

    const removeItem = (id) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const getDiscritpion = (title) => {
        setDiscription(`Оплата за ${title}`)
        console.log(title)
    }

    const navigateHome = () => navigate('/');

    const saveDelivery = () => setIsEditingDelivery(false);

    const handlePay = async () => {
        if (cart.length === 0) {
            alert("Корзина пуста");
            return;
        }

        const description = cart.length === 1
            ? `Оплата за ${cart[0].title}`
            : `Оплата за ${cart.length} товаров`;

        try {
            const response = await fetch("http://localhost:8080/create-payment", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Bearer ${token}` 
                 },
                body: new URLSearchParams({
                    amount: totalPrice.toFixed(2),
                    description: description
                })
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Ошибка сервера:", text);
                alert("Ошибка при создании платежа");
                return;
            }

            let data;
            try {
                data = await response.json();
            } catch {
                const text = await response.text();
                console.error("Ответ не JSON:", text);
                alert("Ошибка при оплате (неверный ответ сервера)");
                return;
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Ошибка при создании платежа");
                console.error(data);
            }
        } catch (error) {
            console.error("Ошибка при оплате:", error);
            alert("Ошибка при оплате");
        }
    };

    return (
        <div className='order-container'>
            <div className='main-order'>
                <div className='orders'>
                    {cart.length === 0 ? (
                        <div>Корзина пуста</div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className='order'>
                                <div className='text-order'><b>Корзина</b></div>
                                <div className='card-info-row'>
                                    <div
                                        className='card-image'
                                        style={{
                                            width: '60px',
                                            height: '80px',
                                            backgroundImage: item.image ? `url(${encodeURI(item.image)})` : undefined,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <div className='main-card-info-container'>
                                        <div className='main-card-info'>
                                            <div className='mini-card-name'>{item.brand} / {item.title}</div>
                                            <div className='color'>Цвет: белый</div>
                                            <div className='p-text'>Склад отгрузки: Кемерово</div>
                                            <div className='ooo'>OOO "{item.brand}"</div>
                                        </div>
                                        <div className='price-container'>
                                            <div className='price'>{item.price}₽</div>
                                            <button className='delete-button' onClick={() => removeItem(item.id)}>Удалить</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className='dilivery-method-container'>
                    <div className='dilivery-f-row'>
                        <div className='dilivery-method-text'><b>Способ доставки</b></div>
                        <button className='change-dilivery' onClick={() => setIsEditingDelivery(true)}>Изменить</button>
                    </div>

                    {isEditingDelivery ? (
                        <div className='edit-delivery'>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Город"
                            />
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Адрес"
                            />
                            <button onClick={saveDelivery}>Сохранить</button>
                        </div>
                    ) : (
                        <div className='place-of-getting'>
                            <div className='first-method-column'>
                                <div className='p-text'>Пункт выдачи</div>
                                <div className='p-text'>Стоимость доставки</div>
                                <div className='dilivery-date'>Доставка</div>
                                <div className='c-text'>27-29 сентября</div>
                            </div>
                            <div className='second-method-column'>
                                <div className='c-text'>г. {city}, {address}, Ежедневно 10:00 - 22:00</div>
                                <div className='cost-dilivery'>Бесплатно</div>
                                <div className='mini-card-image' />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className='payment'>
                <div className='price-row'>
                    <div className='dilivery-method-text'><b>Итого</b></div>
                    <div className='dilivery-method-text'><b>{totalPrice}₽</b></div>
                </div>
                <div className='p-text'>Товары, {cart.length} шт.</div>
                <div className='dilivery-type'>
                    <div className='c-text'>Доставка: </div>
                    <div className='cost-dilivery'>Пункт выдачи</div>
                </div>
                <div className='p-text'>Ежедневно 10:00-22:00</div>
                <div className='p-text'>г. {city}, {address}</div>
                <div className='dilivery-type'>
                    <div className='date'>Дата: </div>
                    <div className='cost-dilivery'>27-29 сентября</div>
                </div>
                <div className='dilivery-type'>
                    <div className='c-text'>Оплата: </div>
                    <div className='cost-dilivery'>Картой</div>
                </div>
                <div className='order-card'>
                    <button className='add-to-order' onClick={handlePay}>ОПЛАТИТЬ ЗАКАЗ</button>
                </div>
                <div className='p-text'>
                    Согласен с условиями Правил<br />
                    пользования торговой площадкой и <br />
                    правилами возраста
                </div>
                <button className='go-home' onClick={navigateHome}>НА ГЛАВНУЮ</button>
            </div>
            
        </div>
    );
}
