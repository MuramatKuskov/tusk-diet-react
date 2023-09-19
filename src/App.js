import { useEffect, useState } from 'react';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';
import { PageNavContext, ShoppingListContext } from './context';
import Index from './pages/Index/Index';
import { register } from 'swiper/element/bundle';

function App() {
  const { tg } = useTelegram();
  const [currentPage, setCurrentPage] = useState();
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    register();
    tg.ready();
    setCurrentPage(<Index />);
  }, []);

  useEffect(() => {
    async function getUser() {
      let data = await fetch(process.env.REACT_APP_backURL + "/getUser?name=" + tg.initDataUnsafe?.user?.username, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      data = await data.json();
      return data[0];
    }

    async function createUser() {
      const username = tg.initDataUnsafe?.user?.username;
      await fetch(process.env.REACT_APP_backURL + "/createUser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
      })
    }

    async function checkIfUserExists() {
      const user = await getUser();
      if (!user) {
        await createUser();
      }
    }

    if (
      !document.cookie?.split(';')?.filter(item => {
        return item === "isFirstVisit=false"
      }).length
    ) {
      checkIfUserExists();
      document.cookie = "isFirstVisit=false";
    }
  }, []);

  return (
    <ShoppingListContext.Provider value={{
      shoppingList,
      setShoppingList
    }}>
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
    </ShoppingListContext.Provider>
  );
}

export default App;