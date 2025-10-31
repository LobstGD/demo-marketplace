import './StoreHeader.css'

export default function StoreHeader() {
    return (
        <header className="s-header">
            <h2 className='s-header-name'>Hotely</h2>

            <nav className='s-navigation-container'>
                <div className='search'></div>
            </nav>
            <div className="bookroom-button">
                <span>Addvisiter</span>
                <div className='circle'></div>
            </div>
        </header>
    )
}