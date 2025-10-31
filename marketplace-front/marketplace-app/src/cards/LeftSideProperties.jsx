import { useNavigate } from 'react-router-dom';
import './LeftSideProperties.css';
import { useState, useEffect } from 'react';

export default function LeftSideProperties() {
    const navigate = useNavigate();

    const [activeButton, setActiveButton] = useState(null); 
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        setToken(storedToken);

        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
    }, []);

    const handleNavigation = (path, buttonName) => {
        setActiveButton(buttonName);
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setActiveButton(null);
        navigate('/');
    };

    return (
        <aside className='left-side-create'>
            <button
                className={`create-module-button ${activeButton === 'Главная' ? 'active' : ''}`}
                onClick={() => handleNavigation("/", "Главная")}
            >
                Главная
            </button>
            <button
                className={`create-module-button ${activeButton === 'C&C and P&C' ? 'active' : ''}`}
                onClick={() => handleNavigation("/", "C&C and P&C")}
            >
                C&C and P&C
            </button>
            <button
                className={`create-module-button ${activeButton === 'Возвраты' ? 'active' : ''}`}
                onClick={() => handleNavigation("/", "Возвраты")}
            >
                Возвраты
            </button>
            <button
                className={`create-module-button ${activeButton === 'Ассортименты' ? 'active' : ''}`}
                onClick={() => handleNavigation("/", "Ассортименты")}
            >
                Ассортименты
            </button>
            <button
                className={`create-module-button ${activeButton === 'Готовые связи' ? 'active' : ''}`}
                onClick={() => handleNavigation("/", "Готовые связи")}
            >
                Готовые связи
            </button>
            <button
                className={`create-module-button ${activeButton === 'Обновления' ? 'active' : ''}`}
                onClick={() => handleNavigation("/", "Обновления")}
            >
                Обновления
            </button>
            <button
                className={`create-module-button ${activeButton === 'Создание карточек товара' ? 'active' : ''}`}
                onClick={() => handleNavigation("/create", "Создание карточек товара")}
            >
                Создание карточек товара
            </button>
            <button
                className={`create-module-button ${activeButton === 'Созданные карточки' ? 'active' : ''}`}
                onClick={() => handleNavigation("/cards-prop", "Созданные карточки")}
            >
                Созданные карточки
            </button>
            <button
                className={`create-module-button ${activeButton === 'Уведомления' ? 'active' : ''}`}
                onClick={() => handleNavigation("/", "Уведомления")}
            >
                Уведомления
            </button>
            <button
                className={`create-module-button ${activeButton === 'Настройки' ? 'active' : ''}`}
                onClick={() => handleNavigation("/", "Настройки")}
            >
                Настройки
            </button>

            {token && (
                <button className='create-module-button logout-button' onClick={handleLogout}>
                    Выйти
                </button>
            )}

            <div className='user-block'>
                {token && user ? (
                    <>
                        <img
                            src={user.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                            alt='avatar'
                            className='user-avatar'
                        />
                        <span className='user-name'>{user.name || 'User'}</span>
                    </>
                ) : (
                    !token && (
                        <button className='login-button' onClick={() => handleNavigation('/login', 'Войти')}>Войти</button>
                    )
                )}
            </div>
        </aside>
    );
}
