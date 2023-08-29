import { useEffect, useState } from 'react';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Landing from './pages/Landing/Landing';
import './App.css';
import { PageNavContext, ShoppingListContext } from './context';
import Index from './pages/Index/Index';
import { register } from 'swiper/element/bundle';

import ShoppingList from './pages/ShoppingList/ShoppingList';

function App() {
  const { tg } = useTelegram();
  const [currentPage, setCurrentPage] = useState();
  // const [shoppingList, setShoppingList] = useState([]);
  const [shoppingList, setShoppingList] = useState([
    { name: "smgfskmg", quantity: 3, unit: "шт" },
    { name: "smgfskmg", quantity: 3, unit: "шт" },
    { name: "smgfskmg", quantity: 3, unit: "шт" },
    { name: "smgfskmg", quantity: 3, unit: "шт" },
    { name: "smgfskmg", quantity: 3, unit: "шт" },
    { name: "smgfskmg", quantity: 3, unit: "шт" }
  ]);

  useEffect(() => {
    register();
    tg.ready();
  }, [])

  useEffect(() => {
    let smth = true;
    if (!smth) return
    if (localStorage.getItem('isFirstEntry') === 'true') {
      console.log('First Visit! Welcome!');
      setCurrentPage(<Landing />);
      localStorage.setItem('isFirstEntry', 'false');
    } else {
      console.log('Not First Visit! Still Welcome!');
      // setCurrentPage(<Index />);
      setCurrentPage(<ShoppingList />)
    }
    smth = false;
  }, [])

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