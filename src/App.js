import { useEffect, useState } from 'react';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Landing from './pages/Landing/Landing';
import './App.css';
import { PageNavContext } from './context';


function App() {
  const { tg } = useTelegram();
  const [currentPage, setCurrentPage] = useState();

  // выбор страницы для первой загрузки, пока без выбора)
  useEffect(() => {
    setCurrentPage(<Landing />)
  }, [])

  useEffect(() => {
    tg.ready();
  }, []);

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