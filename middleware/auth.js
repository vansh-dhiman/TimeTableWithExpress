export function isAuthenticated(req,res,next) {
    if(req.session.isauthenticated){
        next();
    }else{
        res.redirect('/login');
    }
}