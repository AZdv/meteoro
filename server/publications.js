Meteor.publish( 'pomodoros', function() {
	return Pomodoros.find();
});