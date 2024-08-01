const { z } = require("zod");
//
const userSignupSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().min(6),
  profilePic: z.string().url(),
});
//
module.exports = userSignupSchema;
