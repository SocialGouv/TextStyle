const passport = require("passport");
const { User } = require("../db/schema");
const EasyNoPassword = require("easy-no-password");
const nodemailer = require("nodemailer");
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(
  new EasyNoPassword.Strategy(
    {
      secret: 24 * 3600 * 1000
    },
    function(req) {
      // Check if we are in "stage 1" (requesting a token) or "stage 2" (verifying a token)
      if (req.body && req.body.email) {
        return { stage: 1, username: req.body.email };
      } else if (req.query && req.query.email && req.query.token) {
        return { stage: 2, username: req.query.email, token: req.query.token };
      } else {
        return null;
      }
    },
    function(email, token, done) {
      //const username = email.split("@")[0];
      var safeEmail = encodeURIComponent(email);
      var url =
        "https://textstyle.fabrique.social.gouv.fr/verif?email=" +
        safeEmail +
        "&token=" +
        token;
      // Send the link to user via email.  Call done() when finished.

      var transport = nodemailer.createTransport({
        host: "smtp.tipimail.com",
        port: 587,
        auth: {
          user: "236d99641e44f4d85e5c47bbd8a1b7b2",
          pass: "92c8de9ca887c82834cbedae9c07f912"
        }
      });

      var mailOptions = {
        from: "contact@textstyle.fabrique.social.gouv.fr",
        to: email,
        subject: "[TextStyle] Votre lien de connexion",
        html:
          "<p>Bonjour,</p><p> Cliquez <a href='" +
          url +
          "'>ici</a> pour vous authentifier sur la plateforme (ce lien est valable 24h)</p><p>Cordialement,<br/>L'équipe de TextStyle</p>"
        //headers: []
      };

      transport.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
          return done("error", error);
        } else {
          console.log("Email sent: " + info.response);
          return done(info.response);
        }
      });

      transport.close();
    },
    function(email, done) {
      const username = email.split("@")[0];

      // User is authenticated!  Call your findOrCreateUser function here.
      User.query()
        .findOne({ email: email })
        .then(user => {
          return done(null, user.getUser());
        })
        .catch(function() {
          User.query()
            .insert({
              firstName: username,
              lastName: username,
              username: username,
              ministry: " ",
              management: " ",
              email: email
            })
            .then(user => {
              return done(null, user.getUser());
            });
        });
    }
  )
);
module.exports = passport;
