import { useNavigate } from 'react-router-dom';
import './CreateNewCard.css';
import LeftSideProperties from './LeftSideProperties';
import { useState } from 'react';

export default function CreateNewCard() {
    const navigate = useNavigate();

    const goPropertiesBack = () => navigate("/cards-prop");

    const [currentStep, setCurrentStep] = useState(1);

    const [brand, setBrand] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState(""); 
    const [images, setImages] = useState([]);

    const token = localStorage.getItem("jwtToken");

    const nextStep = () => {
        if (currentStep === 1 && (!category || !brand || !title || images.length === 0)) {
            alert("Пожалуйста, заполните все поля");
            return;
        }
        if (currentStep === 2 && !price) {
            alert("Пожалуйста, укажите цену!");
            return;
        }
        if (currentStep < 3) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    function handleImageUpload(e) {
        const files = Array.from(e.target.files).slice(0, 5); 
        setImages(files);
    }

    async function handleCreate(e) {
        e.preventDefault();

        // Проверка всех полей перед отправкой
        if (!category || !brand || !title || !content || !price || images.length === 0) {
            alert("Пожалуйста, заполните все поля!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("brand", brand);
            formData.append("title", title);
            formData.append("content", content);
            formData.append("price", price);
            formData.append("category", category); 

            images.forEach(file => formData.append("images", file));

            const response = await fetch("https://market-place-yn4a.onrender.com/create", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) throw new Error("Ошибка при создании карточки");

            const createdCard = await response.json();
            const storedCards = JSON.parse(localStorage.getItem('cards')) || [];
            localStorage.setItem('cards', JSON.stringify([createdCard, ...storedCards]));

            // Очистка полей
            setBrand(""); setTitle(""); setContent(""); setPrice(""); setCategory(""); setImages([]);
            setCurrentStep(1);

            alert("✅ Карточка успешно создана!");
        } catch (error) {
            console.error("Ошибка при создании:", error);
            alert("Произошла ошибка при создании карточки");
        }
    }

    return (
        <div className='create-card-container'>
            <LeftSideProperties />

            <div className='main-create-container'>
                <div className='first-row'>
                    <div className='property-title'>Создание карточки товара</div>
                    <button className='create-button' onClick={goPropertiesBack}>Назад</button>
                </div>

                <div className='create-card-steps'>
                    <div className={`steps ${currentStep === 1 ? 'active-step' : ''}`}>1</div>
                    <div className='steps-text-container'>Добавление товара</div>
                    <div className='line' />
                    <div className={`steps ${currentStep === 2 ? 'active-step' : ''}`}>2</div>
                    <div className='steps-text-container'>Добавление цены</div>
                    <div className='line' />
                    <div className={`steps ${currentStep === 3 ? 'active-step' : ''}`}>3</div>
                    <div className='steps-text-container'>Основные характеристики</div>
                </div>

                <form className='create-card-area' onSubmit={handleCreate}>
                    {currentStep === 1 && (
                        <>
                            <label htmlFor='product-type' className='create-label'>Выберите продукт</label>
                            <div className="custom-select">
                                <select
                                    id='product-type'
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Выберите категорию</option>
                                    <option value="Женская одежда">Женская одежда</option>
                                    <option value="Мужская одежда">Мужская одежда</option>
                                    <option value="Предметы для взрослых">Предметы для взрослых</option>
                                    <option value="Другое">Другое</option>
                                </select>
                            </div>

                            <label htmlFor='brand-type' className='create-label'>Бренд</label>
                            <input
                                id='brand-type'
                                className='create-input'
                                value={brand}
                                onChange={e => setBrand(e.target.value)}
                                placeholder='Название бренда'
                                required
                            />

                            <label htmlFor='name-type' className='create-label'>Название</label>
                            <input
                                id='name-type'
                                className='create-input'
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder='Название карточки'
                                required
                            />

                            <label htmlFor='image-type' className='create-label'>Изображения товара (до 5)</label>
                            <input
                                id='image-type'
                                type='file'
                                accept='image/*'
                                multiple
                                onChange={handleImageUpload}
                                required
                            />

                            {images.length > 0 && (
                                <div className='image-preview-container'>
                                    {images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={URL.createObjectURL(img)}
                                            alt={`preview-${index}`}
                                            className='image-preview'
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {currentStep === 2 && (
                        <>
                            <label htmlFor='price-type' className='create-label'>Цена</label>
                            <input
                                id='price-type'
                                className='create-input'
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                placeholder='Цена продукта'
                                type='number'
                                required
                            />
                        </>
                    )}

                    {currentStep === 3 && (
                        <>
                            <label htmlFor='description-type' className='create-label'>Описание</label>
                            <input
                                id='description-type'
                                className='create-input'
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder='Описание продукта'
                                required
                            />
                        </>
                    )}

                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                        {currentStep > 1 && (
                            <button type='button' className='publish-button' onClick={prevStep}>
                                Назад
                            </button>
                        )}
                        {currentStep < 3 && (
                            <button type='button' className='publish-button' onClick={nextStep}>
                                Далее
                            </button>
                        )}
                        {currentStep === 3 && (
                            <button className='publish-button' type='submit'>Создать</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
