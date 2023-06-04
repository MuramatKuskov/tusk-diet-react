import { useEffect, useState } from 'react';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Landing from './pages/Landing/Landing';
import './App.css';


function App() {
  const { tg } = useTelegram();
  const [currentPage, setCurrentPage] = useState();

  useEffect(() => {
    setCurrentPage(<Landing setCurrentPage={setCurrentPage} />)
  }, [])

  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <div className='app'>
      <Header setCurrentPage={setCurrentPage} />
      {currentPage}
      <Footer />
    </div>
  );
}

export default App;