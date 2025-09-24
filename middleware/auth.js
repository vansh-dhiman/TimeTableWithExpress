export function isAuthenticated(req,res,next) {
    if(req.session.isauthenticated){
        next();
    }else{
        res.redirect('/login');
    }
}
export async function logout(req,res) {
    req.session.destroy(err =>{
          if(err){
            return res.status(500).send('logout failed');
          }
          res.clearCookie('connect.sid');//browser ka cookie delete kr deta hai 
          res.send('logged out');
    });
}    