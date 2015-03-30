Meteor.publish( 'pomodoros', function() {
	return Pomodoros.find({ userId: this.userId });
});