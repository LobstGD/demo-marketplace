import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // Проверка обязательных полей
    if (!username || !password || !email) {
      alert("Пожалуйста, заполните все поля!");
      return;
    }

    // Проверка пароля: минимум 8 символов, хотя бы одна цифра и одна буква
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert("Пароль должен быть минимум 8 символов, содержать хотя бы одну букву и одну цифру!");
      return;
    }

    try {
      const response = await fetch("https://market-place-yn4a.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        alert("Ошибка регистрации");
        return;
      }

      console.log("Пользователь успешно зарегистрирован");
      navigate("/login");
    } catch (error) {
      console.log("Ошибка регистрации:", error);
    }
  }

  return (
    <div className="register-wrapper">
      <div className="register-page">
        <div className="register-left">
          <img
            src="https://images.unsplash.com/photo-1522204502310-2090d05bdb4d"
            alt="Welcome"
          />
        </div>

        <div className="register-right">
          <div className="register-box">
            <h2>Регистрация</h2>
            <form className="register-form" onSubmit={handleSubmit}>
              <label htmlFor="username">Логин</label>
              <input
                id="username"
                type="text"
                placeholder="Введите логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                title="Минимум 8 символов, хотя бы одна буква и одна цифра"
                required
              />

              <label htmlFor="email">Почта</label>
              <input
                id="email"
                type="email"
                placeholder="Введите почту"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button className="register-button" type="submit">
                Зарегистрироваться
              </button>
            </form>

            <p className="register-link">
              Есть аккаунт? <a href="/login">Войти</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
