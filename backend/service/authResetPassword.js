const JWT = require("jsonwebtoken");
const User = require("../model/userModel");
const Token = require("../model/tokenModel");
// const sendEmail = require("../utils/email/sendEmail");
const crypto = require("crypto");
const bcrypt = require('bcryptjs')

const requestPasswordReset = async(req,res)=>{
    const {email}=req.body;
    const user = await User.findOne({email})
        if(!user){
            res.status(401).json({error:"user does not exist"})
        }
    
    let token = await Token.findOne({id:user._id})
    if(token) await token.deleteOne()
    let resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken,Number(10))

    await new Token({
        id:user._id,
        token:hash,
        createdAt:Date.now(),
    }).save()

   const link = '${clientURL}/passwordReset?token=${resetToken}&id=${user._id}'
   sendEmail(user.email,
        'Password Reset Request',
        {name:user.name,link:link,},
        "./template/requestResetPassword.handlebars"
        )
    return link
}

const resetPassword = async(id,token,password)=>{
    let passwordResetToken = await Token.findOne({ id });
    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token");
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      throw new Error("Invalid or expired password reset token");
    }
    const hash = await bcrypt.hash(password, Number(10));
    await User.updateOne(
      { _id: id },
      { $set: { password: hash } },
      { new: true }
    );
    const user = await User.findById({ _id: id });
    sendEmail(
      user.email,
      "Password Reset Successfully",
      {
        name: user.name,
      },
      "./template/resetPassword.handlebars"
    );
    await passwordResetToken.deleteOne();
    return true;
}

module.exports={requestPasswordReset,resetPassword}