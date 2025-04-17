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
  const [user, setUser] = useState(tg.initDataUnsafe?.user);

  useEffect(() => {
    register();
    tg.ready();
    setCurrentPage(<Index />);
  }, []);

  useEffect(() => {
    async function getUser() {
      let data = await fetch(process.env.REACT_APP_backURL + "/getUser?name=" + user.username, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      data = await data.json();
      return data[0];
    }

    async function createUser() {
      await fetch(process.env.REACT_APP_backURL + "/createUser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user })
      })
    }

    async function checkIfUserExists() {
      const fetchUser = await getUser();
      if (fetchUser) {
        return setUser(fetchUser);
      }
      return createUser();
    }

    /* if (
      !document.cookie?.split(';')?.filter(item => {
        return item === "isFirstVisit=false"
      }).length
    ) {
      
    } */
    checkIfUserExists();
    // document.cookie = "isFirstVisit=false";
  }, []);

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