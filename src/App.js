import { useEffect, useState } from 'react';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Landing from './pages/Landing/Landing';
import './App.css';
import { PageNavContext } from './context';
import Index from './pages/Index/Index';
import { register } from 'swiper/element/bundle';

function App() {
  const { tg } = useTelegram();
  const [currentPage, setCurrentPage] = useState();

  useEffect(() => {
    register();
    tg.ready();
  }, [])

  useEffect(() => {
    if (localStorage.getItem('isFirstEntry') === 'true') {
      setCurrentPage(<Landing />);
      localStorage.setItem('isFirstEntry', 'false');
    } else {
      setCurrentPage(<Index />);
    }
  }, [])

  return (
    <PageNavContext.Provider value={{
      currentPage,
      setCurrentPage
    }}>
      <div className='app'>
        <Header />
        {currentPage}
        <Footer />
      </div>
    </PageNavContext.Provider>
  );
}

export default App;