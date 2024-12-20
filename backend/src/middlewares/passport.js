const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

const jwtStrategy = new Strategy(options, (payload, done) => {
    try{
        const user = {id:payload.id_user};
        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    }catch(err){
        return done(err, false);
    }
});

passport.use(jwtStrategy);