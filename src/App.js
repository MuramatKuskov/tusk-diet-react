import { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';
import { PageNavContext, UserContext } from './context';
import Index from './pages/Index/Index';
import { register } from 'swiper/element/bundle';

const tg = window.Telegram.WebApp;

function App() {
  const [currentPage, setCurrentPage] = useState();
  const [user, setUser] = useState(null);

  // init app
  useEffect(() => {
    register();
    tg.ready();
    handleUser();
    setCurrentPage(<Index />);
  }, []);

  async function handleUser() {
    const data = await getUser();
    if (data) {
      return setUser(data);
    }
    return createUser();
  }

  async function getUser() {
    let data = await fetch(process.env.REACT_APP_API_URL + "users/getUserByTgID?tgID=" + tg.initDataUnsafe.user.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await data.json();
    return data[0];
  }

  async function createUser() {
    const username = tg.initDataUnsafe.user.username || (
      tg.initDataUnsafe.user.last_name ?
        tg.initDataUnsafe.user.first_name + tg.initDataUnsafe.user.last_name :
        tg.initDataUnsafe.user.first_name
    );

    await fetch(process.env.REACT_APP_API_URL + "users/createUser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tgID: tg.initDataUnsafe.user.id, username })
    });
  }

  return (
    <PageNavContext.Provider value={{
      currentPage,
      setCurrentPage
    }}>
      <UserContext.Provider value={{
        user, setUser
      }}>
        <div className='app'>
          <Header />
          {currentPage}
          <Footer />
        </div>
      </UserContext.Provider>
    </PageNavContext.Provider>
  );
}

export default App;