import './App.css';
import CalendarPopup from './assets/CalendarPopup/CalendarPopup';
import { useState } from 'react';

function App() {

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <CalendarPopup selectedDate={selectedDate} handleDateChange={handleDateChange}/>
    </>
  )
}

export default App
