import { useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
import RecipeForm from './components/RecipeForm/RecipeForm';
import Footer from './components/Footer/Footer';


function App() {
  const { tg } = useTelegram();

  useEffect(() => {
    tg.ready();
  }, [])

  return (
    <div className="app">
      <Header></Header>
      <RecipeForm />
      <Footer />
    </div>
  );
}

export default App;
