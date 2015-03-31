Meteor.methods({
	addPomodoro: function( type ) {
		if ( typeof type == 'undefined' )
			type = 'pomodoros';
		if ( ! Meteor.userId() ) {
			if ( Meteor.isClient ) {
				//No Session on Server, duh!
				var currentProfile = Session.get( 'profile' );
				currentProfile[ type ] = currentProfile[ type ] ? currentProfile[ type ] + 1 : 1;
				Session.set( 'profile', currentProfile );
			}
		} else {
			var fields = { userId: 1, _id: 0 };
			fields[ type ] = 1;
			var currentProfile = Pomodoros.findOne({ userId: Meteor.userId() }, { fields: fields });
			if ( ! currentProfile ) {
				currentProfile = { userId: Meteor.userId() };
			}
			currentProfile[ type ] = currentProfile[ type ] ? currentProfile[ type ] + 1 : 1;
			Pomodoros.upsert( { userId: currentProfile.userId }, { $set: currentProfile } );
		}

	},
	getUserProfile: function() {
		return Pomodoros.findOne( { userId: Meteor.userId() } );
	},
	updateUserProfile: function( userProfile ) {
		Pomodoros.update( { userId: Meteor.userId() }, userProfile );
	}
})