import { useState, useRef, useEffect } from 'react';
import './CalendarPopup.css';

const CalendarPopup = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState(() => {
    const savedColors = localStorage.getItem('selectedColors');
    return savedColors ? JSON.parse(savedColors) : {};
  });

  const calendarRef = useRef(null);
  const currentDateRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!calendarRef.current.contains(event.target) && !currentDateRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedColors', JSON.stringify(selectedColors));
  }, [selectedColors]);
  

  const handleDayClick = (day) => {
    setSelectedDate(day);
    // Не закрывать календарь при выборе даты
  };

  const toggleCalendar = () => {
    setIsOpen(!isOpen);
  };

  const handleColorChange = (color) => {
    setSelectedColors((prevColors) => ({
      ...prevColors,
      [selectedDate.toDateString()]: color,
    }));
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setSelectedDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedDate(nextMonth);
  };

  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const getCurrentDateBorderColor = () => {
    const color = selectedColors[selectedDate.toDateString()];
    return color ? `2px solid ${color}` : ''; // Если есть выбранный цвет для текущей даты, устанавливаем его в качестве цвета рамки, иначе - нет рамки
  };

  const renderCalendar = () => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const months = [
      'Январь', 'Февраль', 'Март', 'Апрель',
      'Май', 'Июнь', 'Июль', 'Август',
      'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysArray = [...Array(firstDayOfMonth).keys()].map(() => ({ date: null, className: '' }));
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const color = selectedColors[date.toDateString()] || '';
      daysArray.push({ date, className: color });
    }

    return (
      <div className="calendar">
        <div className="month-navigation">
          <div className="arrow" onClick={handlePrevMonth}>{'<'}</div>
          <div className="current-month">{months[currentMonth]} {currentYear}</div>
          <div className="arrow" onClick={handleNextMonth}>{'>'}</div>
        </div>
        <div className="days-header">
          {days.map((day, index) => (
            <div key={index} className="day">
              {day}
            </div>
          ))}
        </div>
        <div className="days">
          {daysArray.map((item, index) => (
            <div
              key={index}
              className={`day ${item.className}`}
              onClick={() => handleDayClick(item.date)}
            >
              {item.date ? item.date.getDate() : ''}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-popup" ref={calendarRef}>
      <div className='calendar-date'>
        <div className="arrow" onClick={handlePrevDay}>{'<'}</div>
        <div className="current-date" onClick={toggleCalendar} ref={currentDateRef} style={{ border: getCurrentDateBorderColor() }}>
          {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
        </div>
        <div className="arrow" onClick={handleNextDay}>{'>'}</div>
      </div>

      <div className="selected-day-data">
        <div
          className="description"
          style={{ color: 'green' }}
          onClick={() => handleColorChange('green')}
        >
          Зеленый
        </div>
        <div
          className="description"
          style={{ color: 'orange' }}
          onClick={() => handleColorChange('orange')}
        >
          Желтый
        </div>
        <div
          className="description"
          style={{ color: 'gray' }}
          onClick={() => handleColorChange('gray')}
        >
          Серый
        </div>
      </div>

      {isOpen && (
        <div className="calendar-container">
          {renderCalendar()}
        </div>
      )}
      
    </div>
  );
};

export default CalendarPopup;
