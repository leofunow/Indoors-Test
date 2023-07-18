export default function getDateFromString(str: string) {
  try {
    let getYear = (month: number) => {
      if (month < new Date().getMonth()) return new Date().getFullYear() + 1;
      return new Date().getFullYear();
    };
    const russianMonths = {
      января: 0,
      февраля: 1,
      марта: 2,
      апреля: 3,
      мая: 4,
      июня: 5,
      июля: 6,
      августа: 7,
      сентября: 8,
      октября: 9,
      ноября: 10,
      декабря: 11,
    };
    const parts = str.replace(',', '').trim().split(' ');
    const day = parseInt(parts[0]);
    const month = russianMonths[parts[1].toLocaleLowerCase()];
    let year = undefined;
    let hours = undefined;
    let minutes = undefined;
    if (parts[3]) {
      year = parseInt(parts[2]) || getYear(month);
      hours = parseInt(parts[3]?.split(':')[0]) || 0;
      minutes = parseInt(parts[3]?.split(':')[1]) || 0;
    } else {
      year = getYear(month);
      hours = parseInt(parts[2]?.split(':')[0]) || 0;
      minutes = parseInt(parts[2]?.split(':')[1]) || 0;
    }
    const date = new Date(year, month, day, hours, minutes);
    return date;
  } catch (error) {
    return new Date();
  }
}
