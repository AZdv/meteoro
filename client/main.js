// counter starts at 0
Session.setDefault('counter', 0);
Session.setDefault( 'timerType', POMODORO_TIME.toTimerFormat() );
Session.setDefault( 'totalTime', Session.get( 'timerType' ) );
Session.setDefault( 'currentPomodoroTime', Session.get( 'timerType' ) );
Session.setDefault( 'timerStatus', 0 );

Template.body.helpers({
	projectName: function() {
		return projectName;
	}
});

Template.navbar.helpers({
	projectName: function() {
		return projectName;
	}	
})

Template.pomodoro.helpers({
	pomodoroHeight: function( totalHeight ) {
		return ( Session.get( 'currentPomodoroTime' ).fromTimerFormat() / Session.get( 'totalTime' ).fromTimerFormat() ) * totalHeight;
	},
	currentPomodoroTime: function() {
		return Session.get( 'currentPomodoroTime' );
	},
	pomodoroTimer: function() {
		return Session.get( 'pomodoroTimer' );
	}
})

Template.pomodoro.events({
	'click .pomodoro-start': function( e ) {
		if ( ! Session.get( 'pomodoroTimer' ) ) {
			Session.set( 'pomodoroTimer', setInterval( function() {
				currentPomodoroTime = Session.get( 'currentPomodoroTime' ).fromTimerFormat();
				if ( currentPomodoroTime == 0 )
					clearInterval( Session.get( 'pomodoroTimer' ) );
				else
					Session.set( 'currentPomodoroTime', ( currentPomodoroTime - 1 ).toTimerFormat() );

			}, 1 * MILLISECONDS_IN_SECONDS) );

		}
	},
	'click .pomodoro-stop': function( e ) {
		clearInterval( Session.get( 'pomodoroTimer' ) );
		Session.set( 'pomodoroTimer', false )
	},
	'click .pomodoro-reset': function( e ) {
		if ( Session.get( 'pomodoroTimer' ) ) {
			clearInterval( Session.get( 'pomodoroTimer' ) );
			Session.set( 'pomodoroTimer', false )
		}
		Session.set( 'currentPomodoroTime', Session.get( 'timerType' ) );
	},
	'click .pomodoro-change-type': function( e ) {
		if ( window[ e.target.getAttribute( 'data-type' ) ] ) {
			var timerTime = window[ e.target.getAttribute( 'data-type' ) ].toTimerFormat();
			Session.set( 'timerType', timerTime );
			Session.set( 'totalTime', timerTime );
			Session.set( 'currentPomodoroTime', timerTime );
			$( e.target ).closest( '.pomodoro-container' ).find( '.pomodoro-reset' )[0].click();
		}
	}
});

Template.oldPomodoros.helpers({
	pomodoros: function() {
		return Pomodoros.find({}, {sort: {createdAt: -1 }});
	}
})

Template.oldPomodoros.events({
	'click .delete_pomodoro': function ( e ) {
		Pomodoros.remove( this._id );
	}
});

Template.login.events({
	'click #logout-button': function ( e ) {
		Meteor.logout();
	}
})
Template.login.helpers({
	services: function() {
		var services = _.map( Accounts.oauth.serviceNames(), function( item ) { return { 'name': item } } ); //TODO: let's find a less silly way to do this
		return services;
	}
})