Session.setDefault('counter', 0);
Session.setDefault( 'timerType', POMODORO_TIME.toTimerFormat() );
Session.setDefault( 'totalTime', Session.get( 'timerType' ) );
Session.setDefault( 'currentPomodoroTime', Session.get( 'timerType' ) );
Session.setDefault( 'timerStatus', 0 );
Session.setDefault( 'alertMsg', null );
Session.setDefault( 'profile', {} );

Template.body.helpers({
	projectName: function() {
		return projectName;
	},
	alertMsg: function() {
		return Session.get( 'alertMsg' );
	}
});

Template.navbar.helpers({
	projectName: function() {
		return projectName;
	},
	projectSlogan: function() {
		return projectSlogan;
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
	},
	timerTypeCompare: function( type ) {
		return Session.get( 'timerType' ).fromTimerFormat() == window[ type ];
	},
})
var resetPomodoro = function() {
	if ( Session.get( 'pomodoroTimer' ) ) {
		clearInterval( Session.get( 'pomodoroTimer' ) );
		Session.set( 'pomodoroTimer', false )
	}
	Session.set( 'currentPomodoroTime', Session.get( 'timerType' ) );
}
Template.pomodoro.events({
	'click .pomodoro-start': function( e ) {
		if ( ! Session.get( 'pomodoroTimer' ) ) {
			Session.set( 'pomodoroTimer', setInterval( function() {
				currentPomodoroTime = Session.get( 'currentPomodoroTime' ).fromTimerFormat();
				if ( currentPomodoroTime == 0 ) {
					resetPomodoro();
					switch ( Session.get( 'timerType' ).fromTimerFormat() ) {
						case POMODORO_TIME:
							Session.set( 'alertMsg', '<strong>Well done!</strong> 1 Pomodoro Finished!' );
							Meteor.call( 'addPomodoro', 'pomodoros' );
							break;
						case SHORT_BREAK_TIME:
							Session.set( 'alertMsg', '1 Short Break Finished!' );
							Meteor.call( 'addPomodoro', 'shortbreaks' );
							break;
						case LONG_BREAK_TIME:
							Session.set( 'alertMsg', '1 Long Break Finished!' );
							Meteor.call( 'addPomodoro', 'longbreaks' );
							break;
					}
					setTimeout( function() {
						Session.set( 'alertMsg', null );
					}, 3 * MILLISECONDS_IN_SECONDS);
				} else
					Session.set( 'currentPomodoroTime', ( currentPomodoroTime - 1 ).toTimerFormat() );

			}, 1 * MILLISECONDS_IN_SECONDS) );

		}
	},
	'click .pomodoro-stop': function( e ) {
		clearInterval( Session.get( 'pomodoroTimer' ) );
		Session.set( 'pomodoroTimer', false )
	},
	'click .pomodoro-reset': function( e ) {
		resetPomodoro();
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
		if ( Meteor.userId() ) {
			return Pomodoros.findOne({ userId: Meteor.userId() });
		} else {
			return Session.get( 'profile' );
		}
	}
})

var addSessiontoUser = function() {
	if ( Meteor.userId() ) {
		Meteor.call( 'getUserProfile', function( error, userProfile ) {
			var sessionProfile = Session.get( 'profile' );
			userProfile = typeof userProfile == 'undefined' ? {} : userProfile;
			for ( i in sessionProfile )
				userProfile[ i ] = userProfile[ i ] ? userProfile[ i ] + sessionProfile[ i ] : sessionProfile[ i ];
			Meteor.call( 'updateUserProfile', userProfile );
		} );
	}
}

Template.login.events({
	'click #logout-button': function ( e ) {
		Meteor.logout();
	},
	'click .login-button': function( e ) {
		var serviceName = e.currentTarget.id.replace( 'login-buttons-', '' );
		Accounts._loginButtonsSession.resetMessages();

		// XXX Service providers should be able to specify their
		// `Meteor.loginWithX` method name.
		var loginWithService = Meteor["loginWith" +	(serviceName === 'meteor-developer' ? 'MeteorDeveloperAccount' : capitalize(serviceName))];
		var options = {}; // use default scope unless specified
		if (Accounts.ui._options.requestPermissions[serviceName])
			options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
		if (Accounts.ui._options.requestOfflineToken[serviceName])
			options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
		if (Accounts.ui._options.forceApprovalPrompt[serviceName])
			options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];

		loginWithService(options, function (err) {
			addSessiontoUser(); //After login is done, move the session info to the db
		});
	}
})
Template.login.helpers({
	services: function() {
		var services = _.map( Accounts.oauth.serviceNames(), function( item ) { return { 'name': item } } ); //TODO: let's find a less silly way to do this
		return services;
	}
})