var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

isToday = (date) => {
  var today = new Date();
  if(date.getDate() == today.getDate()){
    return true;
  }
  else{
    return false;
  }
}

var getDateAndMonthName = function (timestamp) {
  var date = new Date(timestamp * 1000);
  return date.getDate() + " " + shortMonths[date.getMonth() + 1];
}

var getDayName = function (timestamp) {
  if(isToday()){
    return 'today';
  }else{
    var date = new Date(timestamp * 1000);
    return days[date.getDay()];
  }
}
