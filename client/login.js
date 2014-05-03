Template.signup.events({
    'click button': function (evt, template) {
        evt.preventDefault();
        Accounts.createUser({
            email: template.find('#su-email').value,
            username: template.find('#su-username').value,
            password: template.find('#su-password').value
        });
    }
});

Template.login.events({
    'click button': function (evt, template) {
        evt.preventDefault();
        Meteor.loginWithPassword(
            template.find('#li-username').value, 
            template.find('#li-password').value
        );
    }
});

Template.logout.events({
    'click button': function (evt, template) {
        evt.preventDefault();
        Meteor.logout();
    }
});
