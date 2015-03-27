/* Environment Configuration */
Pomodoros = new Mongo.Collection('timers');
projectName = 'Meteoro'
Number.prototype.toTimerFormat = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    //var hours   = Math.floor(sec_num / 3600);
    var hours   = 0;
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    //if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    //var time    = hours+':'+minutes+':'+seconds;
    var time    = minutes+':'+seconds;
    return time;
}
String.prototype.fromTimerFormat = function () {
	timerArray = this.split( ':' );
	var i = 0;
	var finalValue = 0;
	while ( timerArray.length > 0 ) {
		finalValue += ( timerArray.pop() * ( i == 0 ? 1 : i ) );
		i += 60;
	}
	return finalValue;
}